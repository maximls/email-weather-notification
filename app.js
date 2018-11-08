const yargs = require("yargs");
const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");
const cron = require("node-cron");
const sendWeatherEmail = require("./sendmail/sendmail");

cron.schedule(`1 * * * *`, () => {
  sendWeatherEmail();
  console.log("Running every minute", new Date().getMinutes());
});

const FtoC = f => {
  return Math.round((f - 32) * (5 / 9));
};

//TODO: replace argv with mock db object

const input = {
  time: "8:00 AM",
  address: "205 Osborn Ave, Brantford, ON",
  email: "maxim.lysakovsky@gmail.com",
  units: "ca" //ca, si, us,
};

// const argv = yargs
//   .options({
//     a: {
//       describe: "Input Address",
//       demand: true,
//       alias: "address",
//       string: true
//     }
//   })
//   .help()
//   .alias("help", "h").argv;

const encodedAddress = encodeURIComponent(input.address);

//TODO: create SendEmail function that will use the output of geocode.getCoords below.

//TODO: rework this file to include express.js.

//TODO: research chrone options for Node.

//TODO: every 5 min chron will fire up a function that will check the database for times and then request the weather and email to users.

//TODO: convert below to async/await

geocode.getCoords(encodedAddress, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result.address);
    weather.getWeather(result.latitude, result.longitude, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(
        //   `It is: ${FtoC(
        //     result.currently.temperature
        //   )} C, and feels like ${FtoC(result.currently.apparentTemperature)} C`
        // );
        console.log(JSON.stringify(result, undefined, 2));
      }
    });
  }
});
