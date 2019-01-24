"use strict";
const secretKey = require("./../config/config.json").keys.captchakey;
const fetch = require("node-fetch");

const validateRecaptcha = async requestBody => {
  try {
    const recaptchaResponse = Object.values(requestBody)[4];
    const validate = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`
    );
    return validate.status;
  } catch (err) {
    return err;
  }
};

module.exports = { validateRecaptcha };
