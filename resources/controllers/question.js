/* eslint-disable no-param-reassign */
const QuestionModel = require("../models/question");
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
  async findAll(token) {
    // Find all questions
    const questionsModelArr = await QuestionModel.find(
      {}, (err, docs) => {
        if (err) {
          return err.message;
        }
        return docs;
      },
    );
    // If they exist;
    if (questionsModelArr.length > 0) {
      /*
        Convert all found models to objects and call the refine helper module on each object
        It is important to use Promise to gracefully wait for all elements of the array to resolve
      */
      const questionsObjArr = await Promise.all(questionsModelArr.map((model) => {
        const question = refine(model.toObject(), token);
        return question;
      }));
      return questionsObjArr;
    }
    // If not, return the empty array, anyways
    return questionsModelArr;
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
};
