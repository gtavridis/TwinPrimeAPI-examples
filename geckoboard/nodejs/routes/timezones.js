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
      var result,
          endpointUrl,
          endpointParams;
  
      endpointUrl = "app/data/performance";
      
      endpointParams = {
        app_guid: config.get('app_guid'),
        reldate: "30day",
        country_code: "all",
        timezone: "detail"
      };

      result = {
        "points": {
          "point": []
        }
      };
  
      twinprimeUtils.requestData(res, endpointUrl, endpointParams, function(requestData) {
        if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
          requestData.data.forEach(function(v) {              
            var tzMatch = geos[v.timezone];
        
            result.points.point[result.points.point.length] = {
              "latitude": tzMatch.latitude,
              "longitude": tzMatch.longitude,
              "size": 5
            };
          });
      
          res.json(result);
        } else {
          res.json(result);
        }
      });
    });
  });
  
}