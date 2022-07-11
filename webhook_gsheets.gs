function customOnEdit(e) {
  const range = e.range;
  const row = range.getRow();
  const sheet = e.source.getActiveSheet();

  const data = {
    id: sheet.getRange(row, 1).getValue(),
    title: sheet.getRange(row, 2).getValue(),
    price: sheet.getRange(row, 3).getValue(),
    inventory: sheet.getRange(row, 4).getValue(),
  };
  Logger.log("data: " + JSON.stringify(data));

  const keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (data[key].length === 0) {
      Logger.log(key + " contains no data, aborting.");
      return;
    }
  }

  Logger.log("All values in place, sending.");
  send(data);
}

function send(data) {
  const baseURL = "https://erpintegration.herokuapp.com/productUpdate";

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(baseURL, options);
  Logger.log(JSON.stringify(response));
}
