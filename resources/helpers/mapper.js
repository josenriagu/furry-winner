/* eslint-disable no-param-reassign */
const UserModel = require("../models/user");

module.exports = {
  async mapAll(arr, token) {
    // Convert all found models to objects
    const convertedArr = arr.map((el) => el.toObject());
    // Use Promise to safely map the array and find users for each userId
    const usersArr = await Promise.all(
      convertedArr.map((el) => UserModel.findOne(
        {
          _id: el.userId,
        },
        "displayName reputation",
        (err, doc) => {
          if (err) {
            return err.message;
          }
          return doc;
        },
      )),
    );
    return convertedArr.map((el, idx) => {
      // Let's form a new key to hold the user info
      const creator = {};
      creator.reputation = usersArr[idx].reputation;
      creator.name = usersArr[idx].displayName;
      el.creator = creator;
      // Delete unnecessary keys
      if (token.sub !== el.userId) {
        // remove the notification property, if the request is not coming from the question author
        delete el.notification;
      }
      delete el.userId;
      delete el.__v;
      return el;
    });
  },
  async mapOne(obj, token) {
    let user = await UserModel.findById(obj.userId, (err, doc) => {
      if (err) {
        return err.message;
      }
      return doc;
    });
    if (user) {
      user = user.toObject();
      // Let's form a new key to hold the user info
      const creator = {};
      creator.reputation = user.reputation;
      creator.name = user.displayName;
      obj.creator = creator;
      // Delete unnecessary keys
      if (token.sub !== obj.userId) {
        // remove the notification property, if the request is not coming from the question author
        delete obj.notification;
      }
      delete obj.userId;
      delete obj.__v;
      return obj;
    }
    return user;
  },
};
