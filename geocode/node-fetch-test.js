const fetch = require("node-fetch");
const apiKey = require("./../config/config.json");

const input = {
  time: "8:00 AM",
  address: "205 Osborn Ave, Brantford, ON",
  email: "maxim.lysakovsky@gmail.com",
  units: "ca" //ca, si, us,
};

const encodedAddress = encodeURIComponent(input.address);

const getCoords = address => {
  const coords = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
      apiKey.geokey
    }`
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

getCoords(encodedAddress).then(result => console.log(result));

//const result = async () => {};

// result()
//   .then(result => result.json())
//   .then(coords => console.log(JSON.stringify(coords, undefined, 2)));
