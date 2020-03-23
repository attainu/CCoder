const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminChallengeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    description: {
        type: String,
    },
    question:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    output:{
        type:String,
        required:true,
        trim:true,
    },
    editorial:{
        type:String
    },
    maxScore:{
        type:Number,
        required:true
    },
    testCases:[
        {
          type: Schema.Types.ObjectId,
          ref: "testcase"
        }
      ],
    discussions: [
        {
          type: Schema.Types.ObjectId,
          ref: "discussion"
        }
      ]

    
  },
  { timestamps: true }
);

const Adminchallenge = mongoose.model("adminChallenge", adminChallengeSchema);

module.exports = Adminchallenge;
