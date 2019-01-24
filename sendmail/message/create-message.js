"use strict";
const htmlMessage = require("./html-message.js");

//Proccess data and create html message
const createMessage = (weatherData, location, email, id) => {
  const message = {
    to: email,
    from: "weather@emailweather.info",
    subject: ` ${
      weatherData.alerts
        ? weatherData.alerts[0].title
        : weatherData.daily.data[0].summary
    }`,
    html: htmlMessage(weatherData, location, id)
  };

  return message;
};

module.exports.createMessage = createMessage;
