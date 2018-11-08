const yargs = require("yargs");
const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");

const FtoC = f => {
  return Math.round((f - 32) * (5 / 9));
};

const argv = yargs
  .options({
    a: {
      describe: "Input Address",
      demand: true,
      alias: "address",
      string: true
    }
  })
  .help()
  .alias("help", "h").argv;

const encodedAddress = encodeURIComponent(argv.address);

geocode.getCoords(encodedAddress, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result.address);
    weather.getWeather(result.latitude, result.longitude, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(
          `It is: ${FtoC(
            result.currently.temperature
          )} C, and feels like ${FtoC(result.currently.apparentTemperature)} C`
        );
      }
    });
  }
});
