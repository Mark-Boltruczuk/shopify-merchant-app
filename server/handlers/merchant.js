import Merchant from "../models/merchant";
import { BRONZE } from "../../helpers/Constants";

export const registerMerchant = async (shopOrigin) => {
  await Merchant.create({ shop_origin: shopOrigin, plan: BRONZE });
};

export const checkIfMerchantExist = async (shopOrigin) => {
  const cnt = await Merchant.count({ where: { shop_origin: shopOrigin } });
  return cnt > 0;
};
