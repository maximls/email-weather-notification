"use strict";
require("./config/config");
const { getWeather, formatWeather } = require("./weather/weather");
const cron = require("node-cron");
const message = require("./sendmail/message/create-message");
const mail = require("./sendmail/mailgun");
const { User } = require("./models/user");
const logger = require("./config/logger");
const {
  getTimeZone,
  convertToUTCwithDST,
  rolloverHours
} = require("./timezone/timezone");

//Schedule to run every (hour)
const sendCron = cron.schedule(`* * * * *`, () => {
  sendWeather(); //Send email
  console.log("Running ", new Date().getHours());
});

//Schedule to run every day at 03:00 UTC
const updateCron = cron.schedule(`* 3 * * *`, () => {
  updateDSToffset(); //Check and update DST
});

const now = () => {
  const hours = new Date().getHours();
  return hours.toString().length === 1 ? "0" + hours : hours;
};

const sendWeather = async () => {
  try {
    //Get a list of users
    const users = await User.find({ utcTime_dst: `${now()}:00` });
    users.map(async user => {
      //Get weather data for each user
      //console.log(user);
      const weatherData = await getWeather(
        user.latitude,
        user.longitude,
        user.units
      );
      //Format weather response
      const weatherWithDate = await formatWeather(weatherData, user.units);
      //console.log(weatherWithDate);
      //Create email message
      const messageData = message.createMessage(
        weatherWithDate,
        user.address,
        user.email,
        user._id
      );
      //console.log(messageData);
      //Send email
      mail(messageData);
    });
  } catch (err) {
    logger.log.error(err);
    throw new Error(`ERROR: ${err}`);
  }
};

// Function to run at specific times to check if DST offset is required and if so, update utcTime_dst value, if DST is no longer required, roll back to original UTC time.

const updateDSToffset = async () => {
  try {
    const users = await User.find({}); //Get all users
    users.map(async user => {
      //Get current DST setting for the user
      const liveTimezone = await getTimeZone(
        `${user.latitude},${user.longitude}`,
        Date.now() / 1000
      );

      //Update conditionally
      const timeHours = user.utcTime.split(":");
      const hours = Number.parseInt(timeHours[0], 10);

      if (liveTimezone.dstOffset == 3600) {
        const springForward = rolloverHours(hours, -1); //Use rolloverHours function to limit hours to 24
        User.findByIdAndUpdate(
          { _id: user._id },
          { utcTime_dst: springForward }
        ).then(result => console.log(result.utcTime_dst));
      } else if (user.utcTime !== user.utcTime_dst) {
        User.findByIdAndUpdate(
          { _id: user._id },
          { utcTime_dst: user.utcTime }
        ).then(result => console.log(result.utcTime_dst));
      }
    });
  } catch (err) {
    return err;
  }
};

module.exports = { sendCron, updateCron };
