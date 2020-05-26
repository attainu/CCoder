const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Contest Creation
const contestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    url: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
      },
    endTime: {
      type: Date,
      required: true
    },
    organizationName: {
      type: String,
    },
    organizationType: {
      type: String,
    },
    scoring: {
      type: Number,
      required: true
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    prizes: {
      type: String
    },
    rules: {
      type: String,
      required: true
    },
    signups: [{
      type: Schema.Types.ObjectId,
      ref: "user",
    }],
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    challenges: [
      {
        type: Schema.Types.ObjectId,
        ref: "challenge"
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  { timestamps: true }
);

const Contest = mongoose.model("contest", contestSchema);

module.exports = Contest;
