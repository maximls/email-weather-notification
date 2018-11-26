//const request = require("request");

const fetch = require("node-fetch");
const apiKey = require("./../config/config.json").keys.geokey;
const logger = require("./config/logger");

const getCoords = (location, country) => {
  const coords = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?components=locality:${location}|country:${country}&key=${apiKey}`
  )
    .then(result => {
      switch (result.status) {
        case 200:
          if (Object.keys(result).length !== 0) {
            return result.json();
          } else {
            throw new Error("Geocode API: No results found for this location");
          }
        case "ZERO_RESULTS":
          throw new Error("Geocode API: No results found");

        case "REQUEST_DENIED":
          throw new Error("Geocode API: Request denied by Google API");

        case "INVALID_REQUEST":
          throw new Error("Geocode API: Invalid request, check location");

        case "UKNOWN_ERROR":
          throw new Error("Geocode API: Error, try again");

        default:
          throw new Error("Geocode API: undefined error");
      }
    })
    .catch(err => logger.error(err.message))
    .then(coords => {
      return (result = {
        address: coords.results[0].formatted_address,
        latitude: coords.results[0].geometry.location.lat,
        longitude: coords.results[0].geometry.location.lng
      });
    });

  return coords;
};

// const getCoords = (address, callback) => {
//   request(
//     {
//       url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
//         apiKey.geokey
//       }`,
//       json: true
//     },
//     (error, response, body) => {
//       if (error) {
//         callback("Unable to connect");
//       } else if (
//         body.status == "INVALID_REQUEST" ||
//         body.status == "ZERO_RESULTS"
//       ) {
//         callback("Invalid address");
//       } else {
//         let result = {
//           address: body.results[0].formatted_address,
//           latitude: body.results[0].geometry.location.lat,
//           longitude: body.results[0].geometry.location.lng
//         };
//         callback(undefined, result);
//       }
//     }
//   );
// };

module.exports.getCoords = getCoords;
