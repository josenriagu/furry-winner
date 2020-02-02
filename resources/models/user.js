const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    displayName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 80,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    subscriptions: [
      {
        questionId: { type: String },
      },
    ],
  },
  { timestamps: true },
);

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
