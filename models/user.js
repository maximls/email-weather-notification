const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true
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
  time: {
    type: String,
    required: true,
    minlength: 2
  },
  units: {
    type: String,
    required: true,
    minlength: 2 // auto, ca, si, us,
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
