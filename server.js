"use strict";

require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");
const geocode = require("./geocode/geocode");
const time = require("./timezone/timezone");
const { sendCron, updateCron } = require("./app");
const { getRawWeather } = require("./weather/weather");
const { validateRecaptcha } = require("./captcha/captcha");
const hbs = require("hbs");
const port = 3000;

updateCron; //Check for DST at 03:00 UTC daily
sendCron; // Send emails

const app = express();
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials/", () => {
  console.log("Registered Partials");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === "production") {
    var secureUrl = "https://" + req.headers["host"] + req.url;
    res.writeHead(301, { Location: secureUrl });
    res.end();
  }
  next();
});

const httpHeaders = {
  "x-powered-by": "myserver",
  "Content-Security-Policy":
    "script-src  'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
  "X-Frame-Options": "deny",
  "X-XXS-Protection": "1; mode=block"
};

app.get("/", (req, res) => {
  res
    .status(200)
    .set(httpHeaders)
    .render("index.hbs", {
      method: "post",
      action: ""
    });
});

app.post("/", async (req, res) => {
  let user = {}; //Declare user object here in order to use it in catch block
  try {
    //Validate form captcha
    if (process.env.NODE_ENV != "test") {
      const captcha = await validateRecaptcha(req.body);
      if (captcha !== 200) {
        throw new Error("Invalid captcha");
      }
    }
    //Get lat/long coordinates from Google
    const result = await geocode.getCoords(req.body.location, req.body.country);

    //Check that the weather data is available for the location entered.
    const checkWeather = await getRawWeather(
      result.latitude,
      result.longitude,
      "auto"
    );

    if (checkWeather.status !== 200) {
      throw new Error("No weather data available for your location");
    }

    //Get timezone for the location entered.
    const timezone = await time.getTimeZone(
      `${result.latitude},${result.longitude}`,
      Date.parse(req.body.timestamp) / 1000
    );

    //Convert entered location's timezone to UTC
    const utcTime = await time.convertToUTC(req.body.time, timezone.rawOffset);

    //Use imperial units for United States, metric for all other countries
    const units = req.body.country === "United+States" ? "us" : "ca";

    //Create a new user
    user = new User({
      email: req.body.email,
      address: result.address,
      location: req.body.location,
      country: req.body.country,
      latitude: result.latitude,
      longitude: result.longitude,
      userTime: req.body.time,
      utcTime,
      utcTime_dst: "0",
      timezone,
      units
    });

    await user.save(); //Save user to database

    res
      .status(200)
      .set(httpHeaders)
      .render("success.hbs", {
        message: `Success! You will receive daily emails with weather forecast for ${
          user.location
        } at ${user.email}`,
        id: user._id,
        timestamp: req.body.timestamp
      });
  } catch (err) {
    if (err.code == 11000) {
      res.status(400).render("error.hbs", {
        message: `Looks like ${
          user.email
        } has already been used. Please try a different address.`
      });
    } else {
      res.status(400).render("error.hbs", { message: `${err}, ${err.code}` });
    }
  }
});

//The method below is for the user to confirm that the location is valid before saving to db. This is not implemented so as to save on API calls to Google
app.post("/location/:location&:country", (req, res) => {
  let location = req.params.location;
  let country = req.params.country;
  geocode.getCoords(location, country).then(result => {
    res.status(200).send(result), err => res.status(404).send(err);
  });
});

app.get("/update/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).render("error.hbs", {
      message: `Invalid user ID.`
    });
  }
  User.findById({ _id: id })
    .then(fields => {
      res
        .status(200)
        .set(httpHeaders)
        .render("update.hbs", {
          method: "post",
          action: "/update",
          param: id,
          email: fields.email,
          location: fields.location,
          country: fields.country,
          time: fields.time,
          units: fields.units
        });
    })
    .catch(err => res.status(400).render("error.hbs", { message: err }));
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).render("error.hbs", {
      message: `Invalid user ID.`
    });
  }
  User.findByIdAndUpdate(
    { _id: id },
    {
      email: req.body.email,
      location: req.body.location,
      time: req.body.time,
      units: req.body.units
    },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).render("error.hbs", {
          message: `Invalid user ID.`
        });
      }
      res
        .status(200)
        .set(httpHeaders)
        .render("success.hbs", {
          message: `Information updated. You will receive daily emails with weather forecast for ${
            user.location
          } at ${user.email}`,
          id: user._id,
          timestamp: req.body.timestamp
        });
    })
    .catch(err =>
      res.status(400).render("error.hbs", {
        message: `${err}`
      })
    );
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Invalid ID");
  }
  User.findByIdAndDelete({ _id: id })
    .then(user => {
      res.status(200).render("delete.hbs", {
        message: `We are sad to see you go. Your email ${
          user.email
        } has been unsubscribed.`
      });
    })
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

//module.exports.app = app;
