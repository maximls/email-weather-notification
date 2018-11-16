//const request = require("request");
const apiKey = require("./../config/config.json").keys.weatherkey;
const fetch = require("node-fetch");

const formattedTime = () => {
  const date = new Date(Date.now());
  // let day = date.getDate();
  // let dayOfWeek = date.getDay();
  // let month = date.getMonth();

  return date.toString();
  //return `${dayOfWeek}, ${month} ${day}`;
};

const getWeather = async (latitude, longitude, units) => {
  try {
    const weather = await fetch(
      `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,hourly,flags&units=${units}`
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

// getWeather("43.1393867", "-80.2644254", "auto").then(result =>
//   console.log(result)
// );

const addTime = weather => {
  weather.daily.data.map(obj => (obj.date = formattedTime()));
  weather.date = formattedTime();
  return weather;
};

module.exports = { getWeather, addTime };
