"use strict";

const http = require("http");
var randomStorage = [];

const defaultParams = {
  host: "api.urbandictionary.com",
  port: 80,
  method: "GET",
  path: "/v0/random",
};

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

function get(parameters) {
  return new Promise(function (resolve, reject) {
    var req = http.request(parameters, function (result) {
      // reject on bad status
      if (result.statusCode < 200 || result.statusCode >= 300) {
        return reject(new Error("statusCode=" + result.statusCode));
      }
      // cumulate data
      var rawData = "";
      result.on("data", function (data) {
        rawData += data;
      });
      // resolve on end
      result.on("end", function () {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {
          reject(e);
        }
        resolve(rawData.list);
      });
    });
    // reject on request error
    req.on("error", function (err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err);
    });
    // IMPORTANT
    req.end();
  });
}

module.exports = {
  searchByTerm: function (term) {
    if (typeof term !== "string") {
      return false;
    }
    var myParams = deepCopy(defaultParams);
    myParams.path = `/v0/define?term=${term}`;
    return get(myParams);
  },
  searchById: function (defid) {
    if (!Number.isInteger(defid)) {
      return false;
    }
    var myParams = deepCopy(defaultParams);
    myParams.path = `/v0/define?defid=${defid}`;
    return get(myParams);
  },
  randomSearch: function () {
    var myParams = deepCopy(defaultParams);
    return get(myParams);
  },
};
