var config = require("config"),
    twinprimeUtils = require("../utils/twinprime");

module.exports = function(app){

  //Fetch content type data and return in the required Geckoboard bar chart format
  app.get("/content_types/bar", function (req, res) {
    var endpointUrl,
        endpointParams;
    
    endpointUrl = "app/data/performance";
    
    endpointParams = {
      app_guid: config.get('app_guid'),
      reldate: "30day",
      parent_content_type: "detail"
    };

    twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
      twinprimeUtils.appDetailsToBarFormat(requestData, "parent_content_type", function(result) {
        res.json(result);
      });
    });
  });
  
}