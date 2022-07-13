require("dotenv").config();
const axios = require("axios");

const url = `https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VER}/graphql.json`;

module.exports = async (query, variables) => {
  const {
    data: { data, errors },
  } = await axios({
    url: url,
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    data: {
      query,
      variables,
    },
  });

  if (errors) {
    console.error(errors);
    throw new Error("Error accessing graphql");
  }

  return data;
};
