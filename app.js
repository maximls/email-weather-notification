const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");
const cron = require("node-cron");
const sendWeatherEmail = require("./sendmail/sendmail");
const message = require("./sendmail/create-message");

cron.schedule(`0-59/15 * * * *`, () => {
  //This will run every 15 minutes
  //TODO: 1. Get current time. 2.Query DB for user info every 15 min and find the time that falls within this range

  myWeather(); //Need to create a loop that will fire up this function for every returned db location (write a mock setTimeout with a loop to see how it behaves)
  console.log("Running every minute", new Date().getMinutes());
});

const FtoC = f => {
  return Math.round((f - 32) * (5 / 9));
};

//TODO: make db with model below

const input = {
  time: "8:00 AM",
  location: "Brantford",
  email: "maxim.lysakovsky@gmail.com",
  units: "ca", //ca, si, us,
  country: "us"
};

const encodedLocation = encodeURIComponent(input.location);
const country = input.country;

//TODO: rework this file to include express.js.

//TODO: every 5 min chron will fire up a function that will check the database for times and then request the weather and email to users.

const myWeather = async () => {
  try {
    const coords = await geocode.getCoords(encodedLocation, country);
    const weatherData = await weather.getWeather(
      coords.latitude,
      coords.longitude
    );
    const messageData = message.createMessage(weatherData, coords.address);
    //TODO: Compose email message
    //TODO: Send email(message)
    return messageData;
  } catch (err) {
    throw new Error(`ERROR: ${err}`);
  }
};

myWeather()
  .then(result => {
    console.log(result);
  })
  .catch(err => console.log(err));
