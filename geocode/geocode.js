//const request = require("request");

const fetch = require("node-fetch");
const apiKey = require("./../config/config.json").keys.geokey;

const getCoords = address => {
  const coords = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
  )
    .then(result => result.json())
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
