/* eslint-disable no-param-reassign */
const QuestionModel = require("../models/question");
const mapper = require("../helpers/mapper");
const updater = require("../helpers/updater");

module.exports = {
  async findAll(token) {
    // Find all questions
    const questionsArr = await QuestionModel.find(
      {}, (err, docs) => {
        if (err) {
          return err.message;
        }
        return docs;
      },
    );
    // If they exist;
    if (questionsArr.length > 0) {
      // Passing token down ...
      return mapper.mapAll(questionsArr, token);
    }
    // If not, return the empty array, anyways
    return questionsArr;
  },
  async find(object, token) {
    // Passing token down ...
    return mapper.mapOne(object, token);
  },
  async save(obj) {
    const newQuestion = new QuestionModel(obj);
    let question = await newQuestion.save();
    // For fun, lets give 1 reps to anyone who asks a question in the community
    await updater.reps(obj.userId, 1);
    // Remove unneccessary field(s);
    question = question.toObject();
    delete question.__v;
    return question;
  },
};
