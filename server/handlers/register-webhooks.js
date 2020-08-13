import { registerWebhook } from "@shopify/koa-shopify-webhooks";

export const registerWebhooks = async (
  shop,
  accessToken,
  type,
  url,
  apiVersion
) => {
  console.log(`${process.env.HOST}${url}`);
  const registration = await registerWebhook({
    address: `${process.env.HOST}${url}`,
    topic: type,
    accessToken,
    shop,
    apiVersion,
  });

  if (registration.success) {
    console.log("Successfully registered webhook!");
    console.log(JSON.stringify(registration));
  } else {
    console.log(
      "Failed to register webhook",
      registration.result.data.webhookSubscriptionCreate
    );
  }
};
