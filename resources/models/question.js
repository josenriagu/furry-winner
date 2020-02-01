const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const questionSchema = Schema(
  {
    question: {
      type: String,
      required: true,
      minlength: 2,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        answer: { type: String, required: true },
        userId: { type: String, required: true },
        votes: { type: Number, default: 0 },
      }, { timestamps: true },
    ],
    tags: [
      {
        tag: { type: String },
      },
    ],
    notification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

questionSchema.plugin(uniqueValidator);

const questionModel = mongoose.model("question", questionSchema);
module.exports = questionModel;
