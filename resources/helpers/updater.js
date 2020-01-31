const UserModel = require("../models/user");
const QuestionModel = require("../models/question");

module.exports = {
  async reps(id, reps) {
    const user = await UserModel.findById(id);
    const { reputation } = user.toObject();
    await UserModel.findByIdAndUpdate(
      id,
      { reputation: reputation + reps },
      { new: true },
    );
    return null;
  },
  async vote(obj, element, type) {
    if (element === "question") {
      const { votes } = obj;
      if (type === "up") {
        /* since the obj is no longer a model but an object,
          * we can access the id via '_id',
          * unlike in reps above
        */
        await QuestionModel.findByIdAndUpdate(obj._id, { votes: votes + 1 }, { new: true });
      } else if (type === "down") {
        await QuestionModel.findByIdAndUpdate(obj._id, { votes: votes - 1 }, { new: true });
      }
    }
    return null;
  },
};
