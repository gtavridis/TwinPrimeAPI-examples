var config = require("config"),
    twinprimeUtils = require("../utils/twinprime");

module.exports = function(app){

  //Fetch network data and return in the required Geckoboard pie chart format
  app.get("/requests/text", function (req, res) {
    var endpointUrl,
        endpointParams;

    endpointUrl = "app/data/performance";

    endpointParams = {
      app_guid: config.get('app_guid'),
      reldate: "30day"
    };
    
    twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
      twinprimeUtils.appDetailsToTextFormat(requestData, "Total Requests", "total_request_count", function(result) {
        res.json(result);
      });
    });
  });
  
}