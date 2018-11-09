require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/", (req, res) => {
  const user = new User({
    email: req.body.email,
    location: req.body.location,
    time: req.body.time,
    units: req.body.units
  });
  //TODO: Before saving, perform a look up on the address and return the address to the user to confirm that it is correct. Then save.
  user.save().then(
    doc =>
      res
        .status(200)
        .send(`Success! You will get notifications at ${doc.email}`),
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

app.patch("/update/:email", (req, res) => {
  const email = req.params.email;

  User.findOneAndUpdate(
    { email },
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

// app.delete("/:email", (req, res) => {
//     const email = req.params.email
// })

app.get("/find/:email", (req, res) => {
  const email = req.params.email;
  User.findOne({ email })
    .then(user => res.status(200).send(user), err => res.status(400).send(err))
    .catch(err => res.status(400).send());
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
