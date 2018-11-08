const request = require("request");
const apiKey = require("./../config/config.json");
const getCoords = (address, callback) => {
  request(
    {
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
        apiKey.geokey
      }`,
      json: true
    },
    (error, response, body) => {
      if (error) {
        callback("Unable to connect");
      } else if (
        body.status == "INVALID_REQUEST" ||
        body.status == "ZERO_RESULTS"
      ) {
        callback("Invalid address");
      } else {
        let result = {
          address: body.results[0].formatted_address,
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        };
        callback(undefined, result);
      }
    }
  );
};

module.exports.getCoords = getCoords;
