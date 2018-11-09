//const request = require("request");
const apiKey = require("./../config/config.json");
const fetch = require("node-fetch");

const getWeather = async (latitude, longitude) => {
  try {
    const weather = await fetch(
      `https://api.darksky.net/forecast/${
        apiKey.weatherkey
      }/${latitude},${longitude}?exclude=minutely, hourly&units=ca`
    );
    if (weather.status !== 200) {
      throw new Error("Could not connect to the server");
    } else {
      return weather.json();
    }
  } catch (err) {
    throw new Error("There was an error getting weather");
  }
};

// const getWeather = (lat, long, callback) => {
//   request(
//     {
//       url: `https://api.darksky.net/forecast/${
//         apiKey.weatherkey
//       }/${lat},${long}?exclude=minutely, daily&units=ca`,
//       json: true
//     },
//     (error, response, body) => {
//       if (error) {
//         callback("Unable to connect to forecast.io");
//       } else if (response.statusCode === 404) {
//         callback("Bad Coords");
//       } else if (response.statusCode === 200) {
//         callback(undefined, body);
//       }
//     }
//   );
// };

module.exports.getWeather = getWeather;

//getWeather().then(result => console.log(result.currently, result.daily));
