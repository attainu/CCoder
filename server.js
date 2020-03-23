const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require('./db');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(userRoutes);

app.listen(1234, () => {
    console.log("server is Running");
})

