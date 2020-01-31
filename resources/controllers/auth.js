/* eslint-disable no-param-reassign */
const UserModel = require("../models/user");
const modUser = require("../helpers/modUser");
const { generateToken } = require("../helpers/authenticators");

module.exports = {
  async save(obj) {
    const newUser = new UserModel(obj);
    await newUser.save();
    const user = modUser(newUser.toObject());
    const token = generateToken(user);
    user.token = token;
    return user;
  },
  login(user) {
    const token = generateToken(user);
    user.token = token;
    return user;
  },
};
