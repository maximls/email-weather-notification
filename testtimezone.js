//function to substitute timestamp hours with user submitted time. The result will be used to get Timezone information later

//const timezone = require("./timezone");
const { User } = require("./models/user");
require("./config/config");
const { getWeather, formatWeather } = require("./weather/weather");
const cron = require("node-cron");
const message = require("./sendmail/message/create-message");
const mail = require("./sendmail/mailgun");
const logger = require("./config/logger");
// const replaceTime = (usertime, timestamp) => {
//   const timeArr = Array.from(timestamp.split(" "));
//   console.log(timeArr);
//   // input: Tue Jan 01 2019 12:09:57 GMT-0500 (Eastern Standard Time)
//   // output:  Tue Jan 01 2019 13:00:00
// };

// replaceTime(
//   "13:00",
//   "Tue Jan 01 2019 12:09:57 GMT-0500 (Eastern Standard Time)"
// );

// const convertToUTC = (time, rawOffset) => {
//   const timeArr = time.split(":");
//   return `${Number.parseInt(timeArr[0], 10) - rawOffset / 3600}:00`;
// };

// const convertToUTC = (time, rawOffset) => {
//   const timeArr = time.split(":");
//   const offset = rawOffset / 3600;
//   const hours = Number.parseInt(timeArr[0], 10);

//   let convertedHours = 0;

//   if ((hours - offset) % 24 >= 1) {
//     convertedHours = (hours - offset) % 24;
//   } else {
//     convertedHours = hours - offset;
//   }
//   if (convertedHours < 10) {
//     convertedHours = `0${convertedHours}`;
//   }
//   return `${convertedHours}:00`;
// };

// console.log(convertToUTC("22:00", -18000));

const updateDSToffset = async () => {
  try {
    console.log("looking...");
    const allusers = await User.find1({ utcTime: "11:00" });

    console.log("found user.....");
    allusers.map(user => console.log(user));
  } catch (err) {
    return err;
  }
};

updateDSToffset();

const sendWeather = async () => {
  try {
    //Get a list of users
    const users = await User.find({ email: `maxim.lysakovsky@gmail.com` });
    users.map(async user => {
      //Get weather data for each user
      console.log(user);
      const weatherData = await getWeather(
        user.latitude,
        user.longitude,
        user.units
      );
      //Format weather response
      const weatherWithDate = await formatWeather(weatherData, user.units);
      //Create email message
      const messageData = message.createMessage(
        weatherWithDate,
        user.location,
        user.email,
        user._id
      );
      //Send email
      mail(messageData);
    });
  } catch (err) {
    logger.error(err);
    throw new Error(`ERROR: ${err}`);
  }
};

//sendWeather();
