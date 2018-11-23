require("./config/config");
const { getWeather, formatWeather } = require("./weather/weather");
const cron = require("node-cron");
const message = require("./sendmail/message/create-message");
const mail = require("./sendmail/mailgun");
const { User } = require("./models/user");
const server = require("./server");

//Start the server
server;

//Schedule to run every (hour)
cron.schedule(`* * * * *`, () => {
  sendWeather();
  console.log("Running ", new Date().getMinutes());
});

const sendWeather = async () => {
  try {
    let now = new Date().getHours();
    //Get a list of users
    const users = await User.find({ time: `${now}:00` });
    users.map(async user => {
      //Get weather data for each user
      const weatherData = await getWeather(
        user.latitude,
        user.longitude,
        user.units
      );
      //Format weather response
      const weatherWithDate = await formatWeather(weatherData);
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
    throw new Error(`ERROR: ${err}`);
  }
};
