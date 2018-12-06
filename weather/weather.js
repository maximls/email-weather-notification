"use strict";
const apiKey = require("./../config/config.json").keys.weatherkey;
const fetch = require("node-fetch");
const logger = require("../config/logger");

const formatTime = (time, timezone) => {
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

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function capitalize(string) {
  if (string) {
    return string.replace(/^./, string.split("")[0].toUpperCase());
  } else {
    return string;
  }
}

const formatWeather = (weather, units) => {
  weather.daily.data.map(obj => {
    //console.log(typeof obj.precipType);
    obj.temperatureHigh = Math.round(obj.temperatureHigh);
    obj.temperatureLow = Math.round(obj.temperatureLow);
    obj.apparentTemperatureHigh = Math.round(obj.apparentTemperatureHigh);
    obj.apparentTemperatureLow = Math.round(obj.apparentTemperatureLow);
    obj.temperatureHighTime = formatTime(
      obj.temperatureHighTime,
      weather.timezone
    );
    obj.temperatureLowTime = formatTime(
      obj.temperatureLowTime,
      weather.timezone
    );
    obj.precipType = capitalize(obj.precipType);
    obj.precipAccumulation = (function(value) {
      return value !== "undefined" ? round(value, 1) : "undefined"; // precipAccumulation can be returned as undefined from the server and will break round function.
    })(obj.precipAccumulation);
    obj.windSpeed = Math.round(obj.windSpeed);
    obj.windGust = Math.round(obj.windGust);
  });

  weather.labels = {
    windSpeed: function() {
      return units === "us" ? "mph" : "km/h";
    },
    tempDegrees: function() {
      return units === "us" ? "&#8457;" : "&#8451;";
    },
    precipAccumulation: function() {
      return units === "us" ? "inches" : "centimeters";
    }
  };
  weather.time = formatTime(weather.currently.time, weather.timezone);
  return weather;
};

module.exports = { getWeather, formatWeather };
