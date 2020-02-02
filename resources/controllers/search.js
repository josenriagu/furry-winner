/* eslint-disable no-param-reassign */
const UserModel = require("../models/user");

module.exports = {
  async searchUsers(req) {
    const { keyword, limit } = req.query;
    const regex = new RegExp(keyword, "i");
    // Find and count all matching users
    const [matchedUserModelArr, matchedUsersCount] = await Promise.all([
      UserModel.find({
        displayName: regex,
      }, "displayName reputation").limit(limit).skip(req.skip)
        .exec(),
      UserModel.countDocuments({
        displayName: regex,
      }),
    ]);
    const pageCount = Math.ceil(matchedUsersCount / limit);
    /*
      Toggle this block of code if you wish to remove _id from user objects.
      Then return modResults in place of matchedUserModelArr
    */
    // const modResults = matchedUserModelArr.map((user) => {
    //   user = user.toObject();
    //   delete user._id;
    //   return user;
    // });

    return [matchedUserModelArr, matchedUsersCount, pageCount];
  },
};
