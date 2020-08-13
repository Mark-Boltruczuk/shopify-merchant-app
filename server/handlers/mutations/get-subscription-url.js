import "isomorphic-fetch";
import { gql } from "apollo-boost";

import { createClient } from "../client";
import { BRONZE, SILVER, GOLD, PLUS } from "../../../helpers/Constants";
import { HOST, NODE_ENV } from "../../config";
import Merchant from "../../models/merchant";

const dev = NODE_ENV !== "production";

export function RECURRING_CREATE(url, plan) {
  let amount = 0.0;
  if (plan === SILVER) {
    amount = 9.99;
  } else if (plan === GOLD) {
    amount = 19.99;
  } else if (plan === PLUS) {
    amount = 29.99;
  }

  return gql`
    mutation {
      appSubscriptionCreate(
          name: "${plan} Plan"
          returnUrl: "${url}"
          test: ${dev ? true : false}
          lineItems: [{
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: ${amount}, currencyCode: USD }
              }
            }
          }]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export function RECURRING_CANCEL(id) {
  return gql`
    mutation {
      appSubscriptionCancel(
          id: "${id}"
        ) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx, plan) => {
  const shopOrigin = ctx.cookies.get("shopOrigin");
  const accessToken = ctx.cookies.get("accessToken");
  const client = createClient(shopOrigin, accessToken);

  if (plan === BRONZE) {
    const merchant = await Merchant.findOne({
      where: {
        shop_origin: shopOrigin,
      },
    });

    console.log(merchant);

    const res = await client
      .mutate({
        mutation: RECURRING_CANCEL(merchant.subscription_id),
      })
      .then((response) => response.data);

    console.log(res);

    await merchant.update({ plan: BRONZE, subscription_id: null });

    return true;
  } else {
    const confirmationUrl = await client
      .mutate({
        mutation: RECURRING_CREATE(HOST, plan),
      })
      .then((response) => {
        console.log("----------response.data.appSubscriptionCreate--------");

        console.log(response.data.appSubscriptionCreate);
        console.log(
          "----------response.data.appSubscriptionCreate.userErrors--------"
        );

        console.log(response.data.appSubscriptionCreate.userErrors);

        return response.data.appSubscriptionCreate.confirmationUrl;
      });

    return confirmationUrl;
  }
};
