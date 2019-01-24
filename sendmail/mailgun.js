"use strict";
require("../config/config");

const api_key = process.env.MAILGUN_API_KEY;
const domain = "sendmail.emailweather.info";

const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

const mail = data => {
  mailgun.messages().send(data, (error, body) => {
    if (error) return error;
  });
};

module.exports = mail;
