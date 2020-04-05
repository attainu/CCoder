const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
require("./utils/passport");


// Init
const app = require('./app');

app.listen(1234, function() {
  console.log("Server started");
});

module.exports = app