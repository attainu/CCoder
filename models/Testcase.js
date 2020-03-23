var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var testCaseSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    adminChallenge: {
      type: Schema.Types.ObjectId,
      ref: "adminchallenge"
    }
  },
  { timestamps: true }
);

var Testcase = mongoose.model("testcase", testCaseSchema);

module.exports = Testcase;
 