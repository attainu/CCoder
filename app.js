const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const db = require("./db");
db.connect()
require("./utils/passport");
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require("./routes/apiRoutes");

// Init
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(apiRoutes);
app.use(userRoutes);

module.exports = app