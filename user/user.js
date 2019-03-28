"use strict";

const geocode = require("../geocode/geocode");
const time = require("../timezone/timezone");
const { getRawWeather } = require("../weather/weather");

async function userData(
  location,
  country,
  userTime = "07:00",
  timestamp = "1553783587572"
) {
  //Get lat/long coordinates from Google
  const result = await geocode.getCoords(location, country);

  //Check that the weather data is available for the location entered.
  const checkWeather = await getRawWeather(
    result.latitude,
    result.longitude,
    "auto"
  );

  if (checkWeather.status !== 200) {
    throw new Error("No weather data available for your location");
  }

  //Get timezone for the location entered.
  const timezone = await time.getTimeZone(
    `${result.latitude},${result.longitude}`,
    Date.parse(timestamp) / 1000
  );

  //Convert entered location's timezone to UTC
  const utcTime = await time.convertToUTC(userTime, timezone.rawOffset);

  //Use imperial units for United States, metric for all other countries
  const units = country === "United+States" ? "us" : "ca";

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    address: result.address,
    location,
    utcTime,
    timezone,
    units
  };
}

// prepareUserData("brantford, on", "ca").then(user => console.log(user));

module.exports = userData;
