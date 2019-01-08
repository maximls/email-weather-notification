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
const hbs = require("hbs");
const port = 3000;

updateCron; //Check for DST at 03:00 UTC
sendCron; // Send emails

const app = express();
hbs.registerPartials(__dirname + "/views/partials/");
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).render("index.hbs", {
    method: "post",
    action: ""
  });
});

app.post("/", async (req, res) => {
  try {
    const result = await geocode.getCoords(req.body.location, req.body.country);

    //Check that the weather data is available for the location entered.
    const checkWeather = await getRawWeather(
      result.latitude,
      result.longitude,
      "auto"
    );

    //Get timezone for the location entered.
    const timezone = await time.getTimeZone(
      `${result.latitude},${result.longitude}`,
      Date.parse(req.body.timestamp) / 1000
    );

    //Convert entered location's timezone to UTC
    const utcTime = await time.convertToUTC(req.body.time, timezone.rawOffset);

    const units = req.body.country === "United+States" ? "us" : "ca";
    //Create a new user
    const user = new User({
      email: req.body.email,
      location: result.address,
      country: req.body.country,
      latitude: result.latitude,
      longitude: result.longitude,
      userTime: req.body.time,
      utcTime,
      utcTime_dst: "0",
      timezone,
      units
    });

    //Only save users when weather data is available
    if (checkWeather.status == 200) {
      user.save();
    } else {
      throw new Error("Weather data is not available for this location");
    }

    res.status(200).render("success.hbs", {
      id: user._id,
      location: user.location,
      email: user.email,
      timezone: timezone,
      timestamp: req.body.timestamp
    });
  } catch (err) {
    if (err.code == 11000) {
      res.status(400).send("Your email has already been used to sign up");
    } else {
      res
        .status(400)
        .send(
          "There was an error creating a user. Please confirm all fields are filled in properly"
        );
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
    res.status(404).send("Invalid ID");
  }
  User.findById({ _id: id })
    .then(fields => {
      res.status(200).render("update.hbs", {
        method: "post",
        action: "/update",
        param: id,
        email: fields.email,
        location: fields.location,
        time: fields.time,
        units: fields.units
      });
    })
    .catch(err => res.status(400).send("Cannot find user"));
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Invalid ID");
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
        return res.status(404).send();
      }
      res.status(200).send({ user });
    })
    .catch(err => res.status(400).send());
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Invalid ID");
  }
  User.findByIdAndDelete({ _id: id })
    .then(user => {
      res.status(200).render("delete.hbs", {
        email: user.email
      });
    })
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
