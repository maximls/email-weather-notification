const yargs = require("yargs");
const axios = require("axios");

const FtoC = f => {
  return Math.round((f - 32) * (5 / 9));
};

const argv = yargs
  .options({
    a: {
      describe: "Input Address",
      demand: true,
      alias: "address",
      string: true
    }
  })
  .help()
  .alias("help", "h").argv;

var encodedAddress = encodeURIComponent(argv.address);
const apiKey = "ba7c8a6a220fb178b24a68b772ad2223";
var geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyB2s3BLn0Wn2fnJoXN6qR2QRWtg5JnPV1k`;

axios
  .get(geoCodeUrl)
  .then(response => {
    if (response.data.status === "ZERO_RESULTS") {
      throw new Error("Can not find the address");
    }
    let url = `https://api.darksky.net/forecast/${apiKey}/${
      response.data.results[0].geometry.location.lat
    },${response.data.results[0].geometry.location.lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(url);
  })
  .then(response =>
    console.log(
      `It is: ${FtoC(
        response.data.currently.temperature
      )} C, and feels like ${FtoC(
        response.data.currently.apparentTemperature
      )} C`
    )
  )
  .catch(err => {
    if (err.code === "ENOTFOUND") {
      console.log("Unable to connect to API servers");
    } else {
      console.log(err.message);
    }
  });
