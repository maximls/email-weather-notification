"use strict";

const fetch = require("node-fetch");
const apiKey = require("./../config/config.json").keys.geokey;
const logger = require("../config/logger");

//A function to get user's timezone and convert the time to UTC before storing to user's record
const getTimeZone = async (locationCoords, time) => {
  try {
    const timezone = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${locationCoords}&timestamp=${time}&key=${apiKey}`
    ).then(result => result.json());

    const checkResult = result => {
      if (Object.keys(result).length !== 0) {
        return result;
      } else {
        switch (result.status) {
          case "ZERO_RESULTS":
            throw new Error(
              "Timezone API: No time zone data could be found for the specified position or time. Confirm that the request is for a location on land, and not over water"
            );

          case "REQUEST_DENIED":
            console.log("request denied!");
            logger.error(result.errorMessage);

          case "INVALID_REQUEST":
            throw new Error(
              "Timezone API: Invalid request, check location and timestamp"
            );

          case "UKNOWN_ERROR":
            throw new Error("Timezone API: Error, try again");

          case "OVER_QUERY_LIMIT":
            throw new Error("Timezone API: the requestor has exceeded quota");

          case "OVER_DAILY_LIMIT":
            throw new Error(
              "Timezone API: API key is missing or invalid or Billing has not been enabled on the account or usage cap has been exceeded or provided method of payment is no longer valid "
            );

          default:
            throw new Error("Timezone API: undefined error");
        }
      }
    };

    return checkResult(timezone);
  } catch (err) {
    logger.error(err);
  }
};

//Keep the hours within 24 hours
const rolloverHours = (hours, offset) => {
  let convertedHours = 0;

  if ((hours - offset) % 24 >= 1) {
    convertedHours = (hours - offset) % 24;
  } else {
    convertedHours = hours - offset;
  }
  if (convertedHours < 10) {
    convertedHours = `0${convertedHours}`;
  }
  return `${convertedHours}:00`;
};

const convertToUTC = (time, rawOffset) => {
  const timeArr = time.split(":");
  const offset = rawOffset / 3600;
  const hours = Number.parseInt(timeArr[0], 10);
  return rolloverHours(hours, offset);
};

module.exports = { getTimeZone, convertToUTC, rolloverHours };
