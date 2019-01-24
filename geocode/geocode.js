"use strict";
const fetch = require("node-fetch");
const apiKey = require("./../config/config.json").keys.geokey;
const logger = require("../config/logger");

//Convert user's address to lat/long coordinates to request weather data
const getCoords = async (location, country) => {
  try {
    let finalCoords = {};

    const coords = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?components=locality:${location}|country:${country}&key=${apiKey}`
    ).then(result => result.json());

    const checkCoords = result => {
      if (Object.keys(result.results).length !== 0) {
        return result;
      } else {
        switch (result.status) {
          case "ZERO_RESULTS":
            throw new Error("Geocode API: No results found");

          case "REQUEST_DENIED":
            console.log("request denied!");
            throw new Error("Geocode API: Request denied by Google API");

          case "INVALID_REQUEST":
            throw new Error("Geocode API: Invalid request, check location");

          case "UKNOWN_ERROR":
            throw new Error("Geocode API: Error, try again");

          default:
            throw new Error("Geocode API: undefined error");
        }
      }
    };

    const formatCoords = coords => {
      finalCoords = {
        address: coords.results[0].formatted_address,
        latitude: coords.results[0].geometry.location.lat,
        longitude: coords.results[0].geometry.location.lng
      };
    };

    formatCoords(checkCoords(coords));

    return finalCoords;
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports.getCoords = getCoords;
