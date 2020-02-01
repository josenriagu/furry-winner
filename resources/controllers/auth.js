/* eslint-disable no-param-reassign */
const UserModel = require("../models/user");
const modUser = require("../helpers/modUser");
const { generateToken } = require("../helpers/authenticators");

module.exports = {
  async save(obj) {
    const newUser = new UserModel(obj);
    await newUser.save();
    const token = generateToken(newUser);
    const user = modUser(newUser.toObject());
    user.token = token;
    return user;
  },
  login(userModel) {
    const token = generateToken(userModel);
    const user = modUser(userModel.toObject());
    user.token = token;
    return user;
  },
};
