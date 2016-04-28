var _ = require("lodash"),
    config = require("config"),
    twinprimeUtils = require("../utils/twinprime");

function getGeos(res, callback) {
  var endpointUrl = "geos";
  
  twinprimeUtils.requestData(res, endpointUrl, {}, function(requestData) {
    callback(requestData);
  });
}

module.exports = function(app){
  
  //Fetch content type data and return in the required Geckoboard bar chart format
  app.get("/timezones/map", function (req, res) {
    //Grab geo data so that we can lookup proper lat/long values
    getGeos(res, function(geos) {
      var endpointUrl,
          endpointParams;
  
      endpointUrl = "app/data/performance";
      
      //Image only traffic broken down by timezone
      endpointParams = {
        app_guid: config.get('app_guid'),
        reldate: "30day",
        country_code: "all",
        timezone: "detail",
        parent_content_type: "Image"
      };
  
      twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
        if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
          //We only want to plot bad performance on the map so look for high DCU
          requestData.data = _.filter(requestData.data, function(r) {
            return r.acc_median_dcu > 1000;
          });
        }
        
        twinprimeUtils.appDetailsToMapFormat(requestData, geos, function(result) {
          res.json(result);
        });
      });
    });
  });
  
}