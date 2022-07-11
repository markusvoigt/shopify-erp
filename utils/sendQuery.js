require('dotenv').config()
const axios = require('axios');

const url = `https://${process.env.API_KEY}:${process.env.PW}@${process.env.SHOP_NAME}.myshopify.com/admin/api/2022-07/graphql.json`


module.exports = async (query, variables) => {
    const {data:{data, errors}} = await axios({
        url: url,
        method: "POST",
        headers:{
            Accept: "application/json"
        },
        data:{
            query,
            variables
        }
    });

    if (errors){
        console.error(errors);
        throw new Error("Error accessing graphql");
    }

    return data;

}