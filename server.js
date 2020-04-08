const dotenv = require("dotenv");
dotenv.config();

// Init
const app = require('./app');

app.listen(1237, function() {
  console.log("Server started");
});

module.exports = app