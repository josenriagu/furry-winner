const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const UserSchema = Schema({
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
});

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
