const express = require('express');
const port = process.env.PORT || 3000;
const {google} = require('googleapis');
const { sheets } = require('googleapis/build/src/apis/sheets');
const sendQuery = require('./utils/sendQuery');
const spreadsheetId = "1KioIZQsiAHmgvc0_7fxDfhvT1a0vnp6Vzez4eEhbtEg";


const app = express();
app.use(express.json());


app.get('/', async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});

    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
    res.send(metaData.data);
});

app.get("/testG", async (req, res) => {
    const query = `{
        shop{
          myshopifyDomain
        }
      }`

      try{
      const response = await sendQuery(query);
      res.send(response);
      }catch(error){
        console.log(error);
        res.send('Error');
      }

});

app.post("/productUpdate", async (req, res) => {

    const id = req.body.id;
    const price = req.body.price+"";
    const newInventoryLevel = req.body.inventory;
    
    const updatePriceCall = await updatePrice(id, price);
    if (updatePriceCall.statusCode==200){
        const oldInventoryLevel = JSON.parse(updatePriceCall.body).productVariantUpdate.productVariant.inventoryItem.inventoryLevel.available;
        const inventoryLevelId = JSON.parse(updatePriceCall.body).productVariantUpdate.productVariant.inventoryItem.inventoryLevel.id;

        if (newInventoryLevel != oldInventoryLevel){
            await updateInventoryLevel(inventoryLevelId, newInventoryLevel-oldInventoryLevel);
        }
    }
    res.sendStatus(200);
});

async function updatePrice(id, price){
    const query = `mutation productVariantUpdate($priceInput: ProductVariantInput!) {
        productVariantUpdate(input: $priceInput) {
          productVariant {
            id,
            price,
            inventoryItem{
              id,
              inventoryLevel(locationId:"gid://shopify/Location/64998244374"){
                id,
                available
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`

      const variables = {
        "priceInput":{
            "id": id,
            "price": price
        }
      }

      try{
        const res = await sendQuery(query, variables);
        return {
            statusCode: 200,
            body: JSON.stringify(res)
        }
      }catch(error){
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
      }
}

async function updateInventoryLevel(id, delta){
    const query = `mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
        inventoryAdjustQuantity(input: $input) {
          inventoryLevel {
            available
          }
          userErrors {
            field
            message
          }
        }
      }`

      const variables = {
      "input": {
        "availableDelta": delta,
        "inventoryLevelId": id
      }
    }

    try {
        const res = await sendQuery(query, variables);
        return {
            statusCode: 200,
            body: JSON.stringify(res)
        }
    }catch(error){
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}




app.post('/newOrder', async (req, res) => {
    
    const {email, total_price, total_tax, created_at, name} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Orders!A:E",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[name, created_at, email, total_price, total_tax]],
        }
    });

    res.sendStatus(200);
});









app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});