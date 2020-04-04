const mongoose = require("mongoose");

if(process.env.NODE_ENV==='test'){
  function connect(){
    return new Promise((resolve,reject)=>{
      const Mockgoose = require('mockgoose').Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
        .then(()=>{
          mongoose
  .connect("mongodb://127.0.0.1:27011/Ccoder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((res,err)=>{
    if(err) return reject(err);
    resolve()
  })
        })
    })
  }
  function close(){
    mongoose.disconnect();
  }
}

mongoose
  .connect("mongodb://127.0.0.1:27011/Ccoder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(function() {
    console.log("Database connected successfully");
  })
  .catch(function(err) {
    console.log(err.message);
  });
