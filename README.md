# Shopify Third-Party Integration with Webhooks, Admin API and a Node.js Middleware

Add credentials.json and .env with Shopify Admin API Credentials and run "npm start".
Use ngrok to get publicly available endpoint.

[Youtube Video Tutorial](https://youtu.be/CliC2iNl-fQ)

## Local installation

### Node.js

Developed and tested using Node.js version 18.5.0

Node.js version managed via [ASDF](https://asdf-vm.com/guide/getting-started.html)

To install and use the correct version of Node.js, run the following command from the project folder:

`$ asdf install`

### Install project dependencies

`$ npm install`

### ngrok

Sign up for [ngrok](https://ngrok.com). We need ngrok so that our Google Sheet as well as our Shopify Webhooks can talk to our local App running the middleware.

Install the ngrok binary and then add your auth token:

`$ ngrok config add-authtoken <your token>`

### Google Docs

Make a copy of the "ERP Demo" Google Sheet. Once you have your own copy navigate to [Google Cloud](https://console.cloud.google.com/) and enable the [Google Sheets Api service](https://console.cloud.google.com/marketplace/product/google/sheets.googleapis.com). Generate and download your API access keys in the form of a JSON credentials file. Ensure the client email address has Editor access to the Sheet.

Rename the downloaded credentials file to `credentials.json` and place it in the project root.

### Environment setup

`$ cp .env.example .env`

Input your environment settings into `.env`

## Running

To run with hot-reloading:

`$ npm run dev`

To run without hot-reloading:

`$ npm run start`

## Creating the proxy

Once the App is running, connect the ngrok proxy with:

`$ ngrok http 3000`

Replace port `3000` with your specified port number if you have changed this in your `.env` file.

Running this command will return the `Forwarding` URL. Copy this URL

## Connecting the Google Sheet

With the "ERP Demo" Google Sheet open, navigate to Extensions > Apps Script. Edit the value of `SHOPIFY_MIDDLEWARE_URL` to be your Ngrok Forwarding URL from the step above. Save and close the Script.

