require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");
const geocode = require("./geocode/geocode");
var hbs = require("hbs");
const port = process.env.PORT;

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

app.post("/", (req, res) => {
  geocode
    .getCoords(req.body.location, req.body.country)
    .then(result => {
      const user = new User({
        email: req.body.email,
        location: result.address,
        country: req.body.country,
        latitude: result.latitude,
        longitude: result.longitude,
        time: req.body.time,
        units: req.body.units
      });
      return user;
    })
    .then(user => {
      return user.save();
    })
    .then(
      doc => {
        res
          .status(200)
          .render("success.hbs", { location: doc.location, email: doc.email });
      },
      err => {
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
    );
});

//The method below is for the user to confirm that the location is valid before saving to db.
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

// app.post("/delete/:id", (req, res) => {
//   const email = req.params.id;
//   User.findOneAndDelete({ email }, { select: email })
//     .then(user => res.status(200).send(`User ${user.email} deleted`))
//     .catch(err => res.status(400).send(err));
// });

module.exports = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
