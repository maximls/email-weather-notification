"use strict";
//PROCESS DATA & COMPOSE EMAIL MESSAGE
const htmlMessage = require("./html-message.js");

const createMessage = (weatherData, location, email, id) => {
  const message = {
    to: email, //"maxim.lysakovsky@gmail.com",
    from: "weather@emailweather.info",
    subject: ` ${
      weatherData.alerts
        ? weatherData.alerts[0].title
        : weatherData.daily.data[0].summary
    }`,
    html: htmlMessage(weatherData, location, id),
    text: "testing from the app"
  };

  return message;
};

module.exports.createMessage = createMessage;
