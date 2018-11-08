// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require("@sendgrid/mail");
const message = require("");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "max@autumnandwhite.com",
  from: "test@example.com",
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>"
};

module.exports = sgMail.send(msg);
