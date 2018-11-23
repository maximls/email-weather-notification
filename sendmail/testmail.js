const mail = require("./mailgun");
const html = require("./message/html-message");

let data = {
  from: "Today's Weather <send@sendmail.emailweather.info>",
  to: "maxim.lysakovsky@gmail.com",
  subject: "Today's weather app",
  html: html,
  text: "just testing for now"
};

mail(data);
