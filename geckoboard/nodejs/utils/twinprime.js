var _ = require("lodash"),
    config = require("config"),
    request = require("request");

var apiKey = config.get("apikey"),
    apiBaseUrl = config.get("api_base_url");

//Geckoboard expects dates in the ISO 8601 format. Pad single digit
//month and day values as needed.
function padDate(number) {
  var r = String(number);
  
  if (r.length === 1) {
    r = '0' + r;
  }
  
  return r;
}

/**
 * A collection of useful utility methods for working with AWS
 */
module.exports = {

  requestData: function(res, endpoint, endpointParams, callback) {
    var finalUrl,
        finalUrlParms = {};
    
    finalUrl = apiBaseUrl + endpoint;
    
    if (_.isObject(endpointParams) && !_.isEmpty(endpointParams)) {
      finalUrlParms = endpointParams;
    }
    
    //All requests also require an API key
    finalUrlParms.apikey = apiKey;
    
    request({url:finalUrl, qs:finalUrlParms}, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        var jsonData;
        
        try {
          jsonData = JSON.parse(body);
        } catch(e) {
          jsonData = null
        }
        
        callback(jsonData);
      } else {
        var errMessage = !_.isEmpty(err) ? err : response.statusMessage;        
        res.status(response.statusCode).send({ error: errMessage });
      }
    });
  },
  
  //https://developer.geckoboard.com/#pie-chart
  appDetailsToPieFormat: function(requestData, titleProp, callback) {
    var i = 0,
        result,
        chartColors;
    
    chartColors = config.get('chart_colors');
    result = { item: [] };
    
    if (requestData && !_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
      requestData.data.forEach(function(v) {
        result.item[result.item.length] = {
          "label": v[titleProp],
          "value": v.total_request_count,
          "color": chartColors[i]
        };
      });
    }
    
    callback(result);
  },
  
  //https://developer.geckoboard.com/#bar-chart
  appDetailsToBarFormat: function(requestData, titleProp, valueProp, callback) {
    var result;
    
    result = {
      "x_axis": {
        "labels": []
      },
      "y_axis": {
        "format": "decimal"
      },
      "series": [
        {
          "data": []
        }
      ]
    };
    
    if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
      requestData.data = _.orderBy(requestData.data, valueProp, "desc");
      
      requestData.data.forEach(function(v) {
        result.x_axis.labels[result.x_axis.labels.length] = v[titleProp];
        result.series[0].data[result.series[0].data.length] = v[valueProp];
      });
    }
    
    callback(result);
  },
  
  //https://developer.geckoboard.com/#datetime-example-14
  appDetailsToDateLineFormat: function(requestData, chartName, dateProp, valueProp, callback) {
    var result;
    
    result = {
      "x_axis": {
        "type": "datetime"
      },
      "series": [
        {
          "name": "Visitors per month",
          "data": []
        }
      ]
    };
    
    if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
      requestData.data.forEach(function(v) {
        var dt,
            formattedDate;
        
        dt = new Date(v[dateProp]);
        formattedDate = dt.getFullYear() + "-" + padDate(dt.getMonth() + 1) + "-" + padDate(dt.getDate());

        result.series[0].data[result.series[0].data.length] = [formattedDate, v[valueProp]];
      });
    }
    
    callback(result);
  },
  
  //https://developer.geckoboard.com/#number-and-secondary-stat
  appDetailsToTextFormat: function(requestData, title, valueProp, callback) {
    var result;
    
    result = {
      "item": [ { "text": "", "value": "" } ]
    };
    
    if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
      result.item[0].text = title;
      result.item[0].value = _.sumBy(requestData.data, valueProp);
    }
    
    callback(result);
  },
  
  //https://developer.geckoboard.com/#map
  appDetailsToMapFormat: function(requestData, geos, callback) {
    var result;
    
    result = {
      "points": {
        "point": []
      }
    };
    
    if (!_.isUndefined(requestData.data) && !_.isEmpty(requestData.data)) {
      requestData.data.forEach(function(v) {              
        var tzMatch = geos[v.timezone];
    
        result.points.point[result.points.point.length] = {
          "latitude": tzMatch.latitude,
          "longitude": tzMatch.longitude,
          "color": "ff0000",
          "size": 5
        };
      });
    }
    
    callback(result);
  }

};
