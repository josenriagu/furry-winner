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
        /* The sparse property, tells the database to allow null
         * values which will later be filled with unique values.
         * Read more on sparse index and partial index.
        */
        answer: { type: String, require: true, index: true, unique: true, sparse: true },
        userId: { type: String, require: true, index: true, unique: true, sparse: true },
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
