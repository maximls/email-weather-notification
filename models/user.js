const mongoose = require("mongoose");
const validator = require("validator");
//mongoose.set("debug", true);

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  location: {
    type: String,
    required: true,
    minlength: 3
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  userTime: {
    type: String,
    required: true,
    minlength: 2
  },
  utcTime: {
    type: String,
    required: true
  },
  utcTime_dst: {
    type: String
  },
  timezone: {
    type: Object,
    required: false
  },
  units: {
    type: String,
    required: true,
    minlength: 2 // auto, ca, si, us,
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
