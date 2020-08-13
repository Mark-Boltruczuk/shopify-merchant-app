import { HOST } from "../config";
import axios from "axios";

export const registerVisitJS = async (shop, accessToken) => {
  console.log(shop);
  console.log(accessToken);
  await axios.post(
    `https://${shop}/admin/api/2020-01/script_tags.json`,
    {
      script_tag: {
        event: "onload",
        src: `${HOST}/visit.js`,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    }
  );
};
