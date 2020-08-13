import Router from "koa-router";
import moment from "moment";
import { receiveWebhook } from "@shopify/koa-shopify-webhooks";
import fetch from "isomorphic-unfetch";
import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import Sequelize from "sequelize";
import koaBody from "koa-body";

import Merchant from "./models/merchant";
import Milestone from "./models/milestone";
import Visitor from "./models/visitor";
import Template from "./models/template";

import { getSubscriptionUrl } from "./handlers/index";

import {
  PRODUCT,
  ORDER,
  SALES,
  ACTIVE,
  REACHED,
  CANCELED,
  EXPIRED,
  SPECIFIC,
  NOPERIOD,
  RANGE,
  PERIODIC,
  TRAFFIC,
  BRONZE,
  SILVER,
  GOLD,
  PLUS,
  PENDING,
  APPROVED,
  DECLINED,
  BRONZE_MILESTONES,
  BRONZE_EMAILS,
  SILVER_MILESTONES,
  SILVER_EMAILS,
} from "../helpers/Constants";

import {
  SHOPIFY_API_SECRET,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_FROM_EMAIL,
} from "./config";

const Op = Sequelize.Op;

const auth = {
  auth: {
    api_key: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN,
  },
};
const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const router = new Router();
const webhook = receiveWebhook({
  secret: SHOPIFY_API_SECRET,
});

const koaBodyParser = koaBody({
  multipart: true,
  urlencoded: true,
});

const isReachedMilestone = (milestone, reachedAmount) => {
  return milestone.amount <= reachedAmount;
};

const milestoneUpdate = async (payload, milestone, quantity = 1) => {
  console.log(JSON.stringify(payload));
  console.log("-----------------");
  const startedAt = moment(milestone.started_at);
  const expiredAt = moment(milestone.expired_at);
  const today = moment();

  let customer = null;
  let {
    type,
    amount,
    reached_amount,
    revenue,
    product,
    period,
    period_by_type,
    date_type,
    emailable,
    meta,
    merchant_id,
    status,
  } = milestone;
  let reachedAmount = reached_amount + quantity;

  if (startedAt <= today && today <= expiredAt) {
    status = isReachedMilestone(milestone, reachedAmount) ? REACHED : ACTIVE;
    if (payload) {
      revenue += parseFloat(payload.total_price_usd);
      customer = status === REACHED ? payload.customer : null;
    }

    if (status === REACHED && date_type === PERIODIC) {
      startedAt.add(parseInt(period), `${period_by_type.toLowerCase()}s`);
      expiredAt.add(parseInt(period), `${period_by_type.toLowerCase()}s`);
      await Milestone.create({
        type,
        amount,
        reached_amount: 0,
        revenue: 0,
        product,
        period,
        period_by_type,
        date_type,
        emailable,
        started_at: startedAt,
        expired_at: expiredAt,
        status: ACTIVE,
        customer: null,
        meta,
        merchant_id,
      });
    }
  } else if (today > expiredAt) {
    status = EXPIRED;
    if (date_type === PERIODIC) {
      let prevStartedAt = moment(milestone.started_at),
        currentStartedAt = moment(milestone.started_at);
      let prevExpiredAt = moment(milestone.expired_at),
        currentExpiredAt = moment(milestone.expired_at);
      while (today > currentStartedAt) {
        prevStartedAt = currentStartedAt;
        prevExpiredAt = currentExpiredAt;
        currentStartedAt.add(period, `${period_by_type.toLowerCase()}s`);
        currentExpiredAt.add(period, `${period_by_type.toLowerCase()}s`);
      }
      await Milestone.create({
        type,
        amount,
        reached_amount: 0,
        revenue: 0,
        product,
        period,
        period_by_type,
        date_type,
        emailable,
        started_at: prevStartedAt,
        expired_at: prevExpiredAt,
        status: ACTIVE,
        customer: null,
        meta,
        merchant_id,
      });
    }
  }

  milestone.update({
    status,
    revenue,
    customer,
    reached_amount: reachedAmount,
  });

  if (status === REACHED && payload) {
    const template = await Template.findOne({ where: { type, merchant_id } });
    const merchant = await Merchant.findOne({ where: { id: merchant_id } });
    const from = merchant.shop_owner;
    let subject = "Hey you, awesome!";
    let html =
      "<b>Dear {{customer}}</b><b>Thanks for helping us to reach our destination</b>";

    if (template) {
      subject = template.subject ? template.subject : "Hey you, awesome!";
      html = template.html;
    }

    const ownerRes = await nodemailerMailgun.sendMail({
      from: MAILGUN_FROM_EMAIL,
      to: from,
      subject: "Reached Milestone",
      html: `<p>You reached ${milestone.amount} ${milestone.type} today!</p><p>Enjoy!</p>`,
    });

    console.log(ownerRes);

    if (customer && customer.email) {
      html = html.replace(
        "{{customer}}",
        `${customer.first_name} ${customer.last_name}`
      );
      const customerRes = await nodemailerMailgun.sendMail({
        from,
        to: customer.email,
        subject,
        html,
      });
      console.log(customerRes);
    }
  }
};

/**
 * RESTful APIs
 */
router.get("/api/initials", koaBodyParser, async (ctx) => {
  const shopOrigin = ctx.request.query.shopOrigin;
  const merchant = await Merchant.findOne({
    where: {
      shop_origin: shopOrigin,
    },
  });
  const milestones = await Milestone.findAll({
    where: {
      merchant_id: merchant.id,
    },
  });
  ctx.body = {
    merchant,
    milestones,
  };
});

router.post("/api/isReady", koaBodyParser, async (ctx) => {
  const shopOrigin = ctx.cookies.get("shopOrigin");
  const accessToken = ctx.cookies.get("accessToken");
  const merchant = await Merchant.findOne({
    where: {
      shop_origin: shopOrigin,
    },
  });

  const res = await fetch(`https://${shopOrigin}/admin/api/2020-01/shop.json`, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
    },
  });
  const json = await res.json();
  merchant.update({
    shop_owner: json.shop.email ? json.shop.email : json.shop.customer_email,
    is_ready: true,
    is_plus: json.shop.plan_name === "enterprise",
  });

  ctx.status = 200;
  ctx.body = {
    success: true,
  };
});

router.get("/api/merchant", async (ctx) => {});

router.post("/api/merchant", async (ctx) => {});

router.get("/api/milestone", koaBodyParser, async (ctx) => {
  const milestones = await Milestone.findAll();
  ctx.body = milestones;
});

router.post("/api/milestone", koaBodyParser, async (ctx) => {
  let data = ctx.request.body;
  const milestone = await Milestone.create(data);
  const merchant = await Merchant.findByPk(data.merchant_id);
  await merchant.update({
    milestone_used: merchant.milestone_used + 1,
    email_used: data.emailable ? merchant.email_used + 1 : merchant.email_used,
  });
  ctx.body = milestone;
});

router.put("/api/milestone", async (ctx) => {});

router.delete("/api/milestone", async (ctx) => {});

router.post("/api/choosePlan", koaBodyParser, async (ctx) => {
  const { plan, merchant_id, removal_count } = ctx.request.body;
  const merchant = await Merchant.findByPk(merchant_id);
  let milestone_limit = -1,
    email_limit = -1,
    milestone_used = merchant.milestone_used,
    email_used = merchant.email_used;
  if (plan === BRONZE) {
    milestone_limit = BRONZE_MILESTONES;
    email_limit = BRONZE_EMAILS;
    milestone_used = removal_count ? milestone_limit : milestone_used;
    email_used = removal_count ? email_limit : email_used;
  } else if (plan === SILVER) {
    milestone_limit = SILVER_MILESTONES;
    email_limit = SILVER_EMAILS;
    milestone_used = removal_count ? milestone_limit : milestone_used;
    email_used = removal_count ? email_limit : email_used;
  }
  await merchant.update({
    status: PENDING,
    milestone_limit,
    email_limit,
    milestone_used,
    email_used,
  });

  console.log(removal_count);

  if (removal_count) {
    Milestone.findAll({
      where: {
        status: ACTIVE,
      },
      limit: removal_count,
      order: [["created_at", "DESC"]],
    }).then((res) => {
      res.forEach((m) => m.update({ status: CANCELED }));
    });
  }

  const confirmationUrl = await getSubscriptionUrl(ctx, plan);
  ctx.body = { confirmationUrl };
  ctx.res.statusCode = 200;
});

router.get("/api/template", koaBodyParser, async (ctx) => {
  const { merchant_id, type } = ctx.request.query;
  const template = await Template.findOne({ where: { merchant_id, type } });
  ctx.body = {
    template,
  };
  ctx.res.statusCode = 200;
});

router.post("/api/template", koaBodyParser, async (ctx) => {
  const { merchant_id, type } = ctx.request.body;
  let template = await Template.findOne({ where: { merchant_id, type } });
  if (template) await template.update(ctx.request.body);
  else template = await Template.create(ctx.request.body);
  ctx.body = {
    template,
  };
  ctx.res.statusCode = 200;
});
/**
 * Shopify event Webhook hanlders
 */
router.post("/webhooks/orders/create", webhook, async (ctx) => {
  console.log("received webhook: ", ctx.state.webhook);

  const today = new Date();
  const payload = ctx.state.webhook.payload;
  try {
    const merchant = await Merchant.findOne({
      where: { shop_origin: ctx.state.webhook.domain },
    });

    const milestones = await Milestone.findAll({
      where: {
        status: ACTIVE,
        merchant_id: merchant.id,
        started_at: {
          [Op.lte]: today,
        },
      },
    });

    if (milestones.length > 0)
      merchant.update({
        revenue: merchant.revenue + parseFloat(payload.total_price_usd),
      });

    // Update milestones
    milestones.forEach((milestone) => {
      const type = milestone.type;
      const product = milestone.product;

      // If the goal is SALES type
      if (type === SALES) {
        milestoneUpdate(payload, milestone);
      } else if (type === PRODUCT && product) {
        payload.line_items.forEach((item) => {
          if (product.id.includes(item.product_id)) {
            milestoneUpdate(payload, milestone, item.quantity);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  ctx.res.statusCode = 200;
});

router.post("/webhooks/app/uninstalled", webhook, async (ctx) => {
  console.log("received webhook: ", ctx.state.webhook);

  try {
    const merchant = await Merchant.findOne({
      where: {
        shop_origin: ctx.state.webhook.domain,
      },
    });
    await Milestone.destroy({
      where: {
        merchant_id: merchant.id,
      },
    });
    await Visitor.destroy({
      where: {
        merchant_id: merchant.id,
      },
    });
    await Template.destroy({
      where: {
        merchant_id: merchant.id,
      },
    });
    merchant.destroy();
    ctx.res.statusCode = 200;
  } catch (error) {
    console.log(error);
    ctx.res.statusCode = 200;
  }
});

router.post("/webhooks/app_subscriptions/update", webhook, async (ctx) => {
  console.log("received webhook:", ctx.state.webhook);

  const { domain, payload } = ctx.state.webhook;
  const { name, status, admin_graphql_api_id } = payload.app_subscription;

  if (status === "ACTIVE") {
    const merchant = await Merchant.findOne({ where: { shop_origin: domain } });
    if (name.includes(BRONZE)) {
      await merchant.update({
        plan: BRONZE,
        subscription_id: null,
        status: APPROVED,
      });
    } else if (name.includes(SILVER)) {
      await merchant.update({
        plan: SILVER,
        subscription_id: admin_graphql_api_id,
        status: APPROVED,
      });
    } else if (name.includes(GOLD)) {
      await merchant.update({
        plan: GOLD,
        subscription_id: admin_graphql_api_id,
        status: APPROVED,
      });
    } else if (name.includes(PLUS)) {
      await merchant.update({
        plan: PLUS,
        subscription_id: admin_graphql_api_id,
        status: APPROVED,
      });
    }
  } else if (status === "DECLINED") {
    const merchant = await Merchant.findOne({ where: { shop_origin: domain } });
    merchant.update({ status: DECLINED });
  }

  ctx.res.statusCode = 200;
});

router.post("/webhooks/customers/redact", webhook, async (ctx) => {
  const { shop_domain, customer } = ctx.state.webhook;
  const merchant = await Merchant.findOne({
    where: { shop_origin: shop_domain },
  });
  await Milestone.update(
    { customer: null, emailable: false },
    { where: { merchant_id: merchant.id, customer: customer.email } }
  );

  ctx.res.statusCode = 200;
});

router.post("/webhooks/shop/redact", webhook, async (ctx) => {
  const { shop_domain } = ctx.state.webhook;
  const merchant = await Merchant.findOne({
    where: { shop_origin: shop_domain },
  });
  await Milestone.destroy({ where: { merchant_id: merchant.id } });
  await Template.destroy({ where: { merchant_id: merchant.id } });
  await Visitor.destroy({ where: { merchant_id: merchant.id } });
  merchant.destroy();

  ctx.res.statusCode = 200;
});

router.post("/webhooks/customers/data_request", webhook, async (ctx) => {
  const { shop_domain, customer } = ctx.state.webhook;
  ctx.body = {
    res: {},
  };

  ctx.res.statusCode = 200;
});

/**
 * Custom track event hanlders
 */
router.post("/track/visits", koaBodyParser, async (ctx) => {
  const today = new Date();
  const { visit_token, visitor_token, shop_origin } = ctx.request.body;

  const merchant = await Merchant.findOne({ where: { shop_origin } });
  const visitor = await Visitor.findOne({
    where: { visitor_token, merchant_id: merchant.id },
  });

  if (visitor) {
    visitor.update({ visit_token, visits: visitor.visits + 1 });
  } else {
    await Visitor.create({
      visit_token,
      visitor_token,
      merchant_id: merchant.id,
    });
  }

  const milestones = await Milestone.findAll({
    where: {
      status: ACTIVE,
      merchant_id: merchant.id,
      started_at: {
        [Op.lte]: today,
      },
      type: TRAFFIC,
    },
  });

  milestones.forEach((milestone) => {
    milestoneUpdate(null, milestone, 1);
  });

  ctx.body = {
    merchant_id: merchant.id,
  };
  ctx.res.statusCode = 200;
});

router.post("/track/events", koaBodyParser, async (ctx) => {
  const {
    visit_token,
    visitor_token,
    merchant_id,
    events_json,
  } = ctx.request.body;
  const visitor = await Visitor.findOne({
    where: {
      visitor_token,
      merchant_id,
    },
  });

  const today = new Date();
  const events = JSON.parse(events_json);
  const viewEvent = events.find((e) => e.name === "$view");

  if (viewEvent) {
    const visitor = await Visitor.findOne({
      where: { visitor_token, merchant_id },
    });

    if (visitor && visitor.visit_token !== visit_token) {
      visitor.update({ visit_token, visits: visitor.visits + 1 });
      const milestones = await Milestone.findAll({
        where: {
          status: ACTIVE,
          merchant_id,
          started_at: {
            [Op.lte]: today,
          },
          type: TRAFFIC,
        },
      });

      milestones.forEach((milestone) => {
        milestoneUpdate(null, milestone, 1);
      });
    }
  }

  // if (visitor.visit_token !== visit_token) {
  //   const milestones = await Milestone.findAll({
  //     where: {
  //       status: ACTIVE,
  //       merchant_id,
  //       started_at: {
  //         [Op.lte]: today,
  //       },
  //       type: TRAFFIC
  //     }
  //   });

  //   milestones.forEach((milestone) => {
  //     milestoneUpdate.update(null, milestone, 1);
  //   });
  // }

  ctx.res.statusCode = 200;
});

export default router;
