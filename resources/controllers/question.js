const QuestionModel = require("../models/question");
const UserModel = require("../models/user");
const mapper = require("../helpers/mapper");
const updater = require("../helpers/updater");

async function refine(object, token) {
  // Passing token down ...
  const question = await mapper.mapOne(object, token);
  if (question.answers.length > 0) {
    /*
    If not empty, let's add more context to the returned answers array in the question object.
  */
    const answersArr = await mapper.mapAll(question.answers, token);
    question.answers = answersArr;
    return question;
  }
  return question;
}

module.exports = {
  async findAll(req) {
    const { keyword, limit } = req.query;
    // Initialize variables to hold our results
    let questionsModelArr;
    let questionsCount;
    // Pass condition to determine which Promise to run
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      // Find and count all matching questions
      [questionsModelArr, questionsCount] = await Promise.all([
        QuestionModel.find({
          question: regex,
        }).limit(limit).skip(req.skip)
          .exec(),
        QuestionModel.countDocuments({
          question: regex,
        }),
      ]);
    } else {
      // Find and count all questions instead
      [questionsModelArr, questionsCount] = await Promise.all([
        QuestionModel.find(
          {},
        ).limit(limit).skip(req.skip).exec(),
        QuestionModel.countDocuments({}),
      ]);
    }

    const pageCount = Math.ceil(questionsCount / req.query.limit);
    // If they exist;
    if (questionsModelArr.length > 0) {
      /*
        Convert all found models to objects and call the refine helper module on each object
        It is important to use Promise to gracefully wait for all elements of the array to resolve
      */
      const questionsObjArr = await Promise.all(questionsModelArr.map((model) => {
        const question = refine(model.toObject(), req.decodedToken);
        return question;
      }));

      return [questionsObjArr, questionsCount, pageCount];
    }
    // If not, return the empty array, anyways
    return [questionsModelArr, questionsCount, pageCount];
  },
  refine, // Also eporting this for use, outside this module
  async save(obj) {
    const newQuestion = new QuestionModel(obj);
    let question = await newQuestion.save();
    // For fun, lets give 1 reps to the author of the question
    await updater.reps(obj.userId, 1);
    // Remove unneccessary field(s);
    question = question.toObject();
    delete question.__v;
    return question;
  },
  async saveAnswer(answer, userId, question) {
    const answerToSave = {
      answer,
      userId,
    };
    question.answers.push(answerToSave);
    const questionToSave = new QuestionModel((question));
    const savedQuestionModel = await QuestionModel.findByIdAndUpdate(
      question._id, questionToSave,
      { new: true },
      async (err, doc) => {
        if (err) {
          return err.message;
        }
        /*
          At this point, the question has been saved successfully
          For fun, lets give 1 reps to the author of the answer
        */
        await updater.reps(userId, 1);
        return doc;
      },
    );
    return savedQuestionModel;
  },
  async saveSubscription(req) {
    /*
      At this point, we have access to the user making the request
    */
    const userToUpdate = req.user;
    // Let's update user's array of subscriptions
    userToUpdate.subscriptions.push({ questionId: req.params.id });
    let updatedUser = await UserModel.findByIdAndUpdate(
      userToUpdate._id,
      userToUpdate,
      { new: true },
    );
    // Convert the returned user model to object and add more context
    updatedUser = updatedUser.toObject();
    const refined = await Promise.all(updatedUser.subscriptions.map(async (obj) => {
      const question = await QuestionModel.findById(obj.questionId, (err, doc) => {
        if (err) return false;
        return doc;
      });
      const refinedQ = await refine(question.toObject(), req.decodedToken);
      return refinedQ;
    }));
    // Extract required fields
    const user = {
      reputation: updatedUser.reputation,
      displayName: updatedUser.displayName,
      subscriptions: refined,
    };
    // Return updated user, now with more context
    return user;
  },
};
