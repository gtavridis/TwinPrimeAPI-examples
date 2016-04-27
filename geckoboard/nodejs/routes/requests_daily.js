var config = require("config"),
    twinprimeUtils = require("../utils/twinprime");

module.exports = function(app){

  //Fetch content type data and return in the required Geckoboard bar chart format
  app.get("/requests/line", function (req, res) {
    var endpointUrl,
        endpointParams;
    
    endpointUrl = "app/data/performance/breakdown";
    
    endpointParams = {
      app_guid: config.get('app_guid'),
      reldate: "30day"
    };

    twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
      twinprimeUtils.appDetailsToDateLineFormat(requestData, "Requests by Day", "rollup_date", "total_request_count", function(result) {
        res.json(result);
      });
    });
  });
  
}