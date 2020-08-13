import { createClient } from "./client";
import { getOneTimeUrl } from "./mutations/get-one-time-url";
import { getSubscriptionUrl } from "./mutations/get-subscription-url";
import { registerWebhooks } from "./register-webhooks";
import { registerMerchant, checkIfMerchantExist } from "./merchant";
import { registerVisitJS } from "./visit";

export {
  createClient,
  getOneTimeUrl,
  getSubscriptionUrl,
  registerWebhooks,
  registerMerchant,
  checkIfMerchantExist,
  registerVisitJS,
};
