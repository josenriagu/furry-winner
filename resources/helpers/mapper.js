/* eslint-disable no-param-reassign */
const UserModel = require("../models/user");

/*
  Note: Mapper helper functions have been designed to add more context to
  an object or an array of objects, using the provided token.
  Please be sure you are passing in objects/array of objects and not models.
*/

module.exports = {
  async mapAll(objArr, token) {
    // Use Promise to safely map the array and find users for each userId
    const usersArr = await Promise.all(
      objArr.map((el) => UserModel.findOne(
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
    return objArr.map((obj, idx) => {
      // Let's form a new key to hold the author info
      const author = {};
      author.reputation = usersArr[idx].reputation;
      author.name = usersArr[idx].displayName;
      // Delete unnecessary keys
      if (token === undefined || (token && token.sub !== obj.userId)) {
        /*
          Delete notification property:
           - [unauthenticated users]; for all questions
           - [authenticated users]; for questions where they are not authors
        */
        delete obj.notification;
      }
      delete obj.userId;
      delete obj.__v;
      // Create author property and assign to author variable
      obj.author = author;
      return obj;
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
      // Let's form a new key to hold the author info
      const author = {};
      author.reputation = user.reputation;
      author.name = user.displayName;
      // Delete unnecessary keys
      if (token === undefined || (token && token.sub !== obj.userId)) {
        /*
          Delete notification property:
           - [unauthenticated users]; for all questions
           - [authenticated users]; for questions where they are not authors
        */
        delete obj.notification;
      }
      delete obj.userId;
      delete obj.__v;
      // Create author property and assign to author variable
      obj.author = author;
      return obj;
    }
    return user;
  },
};
