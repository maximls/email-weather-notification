require("./config/config");
const geocode = require("./geocode/geocode");
const { getWeather, addTime } = require("./weather/weather");
const cron = require("node-cron");
const message = require("./sendmail/create-message");
//const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const sgMail = require("@sendgrid/mail");
const server = require("./server");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

server;

cron.schedule(`* * * * *`, () => {
  findUsers();
  console.log("Running ", new Date().getMinutes());
});

const findUsers = async () => {
  try {
    let now = new Date().getHours();
    const users = await User.find({ time: `${now}:00` });
    users.map(async user => {
      const weatherData = await getWeather(
        user.latitude,
        user.longitude,
        user.units
      );
      const weatherWithDate = await addTime(weatherData);

      const messageData = message.createMessage(
        weatherWithDate,
        user.location,
        user.email,
        user._id
      );
      const email = await sgMail.send(messageData);
      //return email[0].statusCode;
    });
  } catch (err) {
    throw new Error(`ERROR: ${err}`);
  }
};
