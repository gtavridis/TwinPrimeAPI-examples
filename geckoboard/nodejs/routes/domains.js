var config = require("config"),
    twinprimeUtils = require("../utils/twinprime");

module.exports = function(app){

  //Fetch content type data and return in the required Geckoboard bar chart format
  app.get("/domains/bar", function (req, res) {
    var endpointUrl,
        endpointParams;

    endpointUrl = "app/data/performance";

    endpointParams = {
      app_guid: config.get('app_guid'),
      reldate: "30day",
      url_domain: "detail"
    };
    
    twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
      twinprimeUtils.appDetailsToBarFormat(requestData, "url_domain", "total_request_count", function(result) {
        res.json(result);
      });
    });
  });
  
}