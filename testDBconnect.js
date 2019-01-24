require("./config/config");
const express = require("express");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");

User.findOne({ email: "test@test.com" }).then(users => console.log(users._id));
