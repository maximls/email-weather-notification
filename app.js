const yargs = require("yargs");
const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");
const cron = require("node-cron");
//const sendWeatherEmail = require("./sendmail/sendmail");

cron.schedule(`1 * * * *`, () => {
  myWeather(); //Need to create a loop that will fire up this function for every returned db address (write a mock setTimeout with a loop to see how it behaves)
  console.log("Running every minute", new Date().getMinutes());
});

const FtoC = f => {
  return Math.round((f - 32) * (5 / 9));
};

//TODO: make db with model below

const input = {
  time: "8:00 AM",
  address: "205 Osborn Ave, Brantford, ON",
  email: "maxim.lysakovsky@gmail.com",
  units: "ca" //ca, si, us,
};

const encodedAddress = encodeURIComponent(input.address);

//TODO: create SendEmail function that will use the output of geocode.getCoords below.

//TODO: rework this file to include express.js.

//TODO: every 5 min chron will fire up a function that will check the database for times and then request the weather and email to users.

const myWeather = async () => {
  try {
    const coords = await geocode.getCoords(encodedAddress);
    const weatherData = weather.getWeather(coords.latitude, coords.longitude);
    //TODO: Compose email message
    //TODO: Send email(message)
    return weatherData;
  } catch (err) {
    throw new Error(`ERROR: ${err}`);
  }
};

myWeather()
  .then(result => {
    console.log(result);
  })
  .catch(err => console.log(err));

// geocode.getCoords(encodedAddress, (error, result) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(result.address);
//     weather.getWeather(result.latitude, result.longitude, (error, result) => {
//       if (error) {
//         console.log(error);
//       } else {
//         // console.log(
//         //   `It is: ${FtoC(
//         //     result.currently.temperature
//         //   )} C, and feels like ${FtoC(result.currently.apparentTemperature)} C`
//         // );
//         console.log(JSON.stringify(result, undefined, 2));
//       }
//     });
//   }
// });
