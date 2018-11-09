const fetch = require("node-fetch");
const apiKey = require("./../config/config.json");

const getCoords = address => {
  const coords = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
      apiKey.geokey
    }`
  )
    .then(result => result.json())
    .then(coords => {
      return (result = {
        latitude: coords.results[0].geometry.location.lat,
        longitude: coords.results[0].geometry.location.lng
      });
    });
  return coords;
};

getCoords(encodedAddress).then(result => console.log(result));
