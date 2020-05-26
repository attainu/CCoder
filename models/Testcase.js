var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Test Case Schema
var testCaseSchema = new Schema(
  {
    input: {
      type: String,
      required: true
    },
    rawinput:{
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "challenge"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  { timestamps: true }
);

var Testcase = mongoose.model("testcase", testCaseSchema);

module.exports = Testcase;
 