
// Init
const app = require('./app');

app.listen(1234, function() {
  console.log("Server started");
});

module.exports = app