import "@babel/polyfill";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import session from "koa-session";
import cors from "koa2-cors";

import * as handlers from "./handlers/index";
import Merchant from "./models/merchant";
import router from "./router";
import {
  NODE_ENV,
  PORT,
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  SCOPES,
  HOST,
} from "./config";
import { PENDING } from "../helpers/Constants";

const port = parseInt(PORT, 10) || 3000;
const dev = NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  server.keys = [SHOPIFY_API_SECRET];

  server.use(session({ secure: true, sameSite: "none" }, server));
  server.use(graphQLProxy({ version: ApiVersion.January20 }));
  server.use(cors({ origin: "*" }));

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.cookies.set("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.cookies.set("host", HOST, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        console.log("----------shopOrigin-----------");
        console.log(shop);
        console.log("accessToken", accessToken);

        const merchantExist = await handlers.checkIfMerchantExist(shop);
        if (!merchantExist) {
          server.context.client = await handlers.createClient(
            shop,
            accessToken
          );

          // await handlers.getSubscriptionUrl(ctx);
          await handlers.registerMerchant(shop);
          await handlers.registerVisitJS(shop, accessToken);
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_CREATE",
            "/webhooks/orders/create",
            ApiVersion.January20
          );
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "APP_UNINSTALLED",
            "/webhooks/app/uninstalled",
            ApiVersion.January20
          );
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "APP_SUBSCRIPTIONS_UPDATE",
            "/webhooks/app_subscriptions/update",
            ApiVersion.January20
          );
          ctx.redirect("/");
        } else {
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_CREATE",
            "/webhooks/orders/create",
            ApiVersion.January20
          );
          ctx.redirect("/");
        }
      },
    })
  );

  // server.use(router.allowedMethods());
  // server.use(router.routes());
  // server.use(verifyRequest());

  // server.use(async ctx => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.statusCode = 200;
  //   return;
  // });

  // router.get("/visit.js", async (ctx) => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.statusCode = 200;
  // });

  router.get("/", verifyRequest(), async (ctx) => {
    if (ctx.request.query.charge_id) {
      const shopOrigin = ctx.cookies.get("shopOrigin");
      const intervalObj = setInterval(async () => {
        let merchant = await Merchant.findOne({
          where: { shop_origin: shopOrigin },
        });
        if (merchant.status !== PENDING) {
          clearInterval(intervalObj);
          await handle(ctx.req, ctx.res);
        }
      }, 1000);
    } else {
      await handle(ctx.req, ctx.res);
    }
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  router.get("*", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
