const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();


module.exports = {
  connect: function () {
    if (process.env.NODE_ENV == 'test') {
      mongod.getUri().then(function (uri) {
        mongoose
          .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
          })
          .then(function () {
            console.log("Test Database connected successfully");
          })
          .catch(function (err) {
          });
      })

    }

    else {
      mongoose
        .connect("mongodb://127.0.0.1:27011/Ccoder", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        })
        .then(function () {
          console.log("Database connected successfully");
        })
        .catch(function (err) {
          console.log(err.message);
        });
    }
  },
  disconnect: function(){
    console.log('Database Disconnected Successfully')
    mongoose.disconnect();
  }
}


