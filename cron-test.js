const cron = require("node-cron");
const sendWeatherEmail = require("./sendmail/sendmail");

// const input = {
//   time: "8:00 AM",
//   address: "205 Osborn Ave, Brantford, ON",
//   email: "max@autumnandwhite.com",
//   units: "ca" //ca, si, us,
// };

cron.schedule(`39-51 * * * *`, () => {
  sendWeatherEmail;
  console.log("Running every 3 second", arguments[0]);
});

//console.log(sendWeatherEmail);

//sendWeatherEmail;
