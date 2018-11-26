const apiKey = require("./../config/config.json").keys.weatherkey;
const fetch = require("node-fetch");
const logger = require("../config/logger");

const formattedTime = (time, timezone) => {
  const date = new Date(time * 1000);
  let options = {
    timeZone: timezone,
    hour12: true,
    hour: "2-digit",
    minute: "2-digit"
  };
  return date.toLocaleTimeString("en-ca", options);
};

const getWeather = async (latitude, longitude, units) => {
  try {
    const weather = await fetch(
      `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,hourly,flags&units=${units}`
    );
    console.log(weather.status);
    if (weather.status === 200) {
      return weather.json();
    } else if (weather.status === 400) {
      throw new Error("400 The given location is invalid");
    } else if (weather.status === 403) {
      throw new Error("403 Access forbidden. Check API key.");
    } else {
      throw new Error("DarkSky API/Server error.");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

//getWeather("43.1393867", "-80.2644254", "auto").then(result => result);

const roundTemps = temp => {
  return Math.round(temp);
};

const formatWeather = weather => {
  weather.daily.data.map(obj => {
    obj.temperatureHigh = roundTemps(obj.temperatureHigh);
    obj.temperatureLow = roundTemps(obj.temperatureLow);
    obj.apparentTemperatureHigh = roundTemps(obj.apparentTemperatureHigh);
    obj.apparentTemperatureLow = roundTemps(obj.apparentTemperatureLow);
    obj.temperatureHighTime = formattedTime(
      obj.temperatureHighTime,
      weather.timezone
    );
    obj.temperatureLowTime = formattedTime(
      obj.temperatureLowTime,
      weather.timezone
    );

    obj.date = formattedTime();
  });
  weather.date = formattedTime(weather.currently.time, weather.timezone);
  return weather;
};

module.exports = { getWeather, formatWeather };
