const express = require("express");

const controller = require("../controllers/question");

const { restrict } = require("../helpers/authenticators");
const v = require("../helpers/validators");
const m = require("../helpers/messageStrings");
const genError = require("../helpers/error");
const updater = require("../helpers/updater");

const router = express.Router();

/* Get all questions */
// Update: I made this endpoint pseudo-private by modifying restrict middleware ...
router.get("/", restrict, async (req, res, next) => {
  try {
    /*
      Token will let us strip author-specific field(s) like
      'notification' from the question for a non-author
      Recall that at this point (if authenticated);
      we have access to the decodedToken in the req object
     */
    const questions = await controller.findAll(req.decodedToken);
    if (questions.length === 0) {
      /*
        At first, the collection may be empty, let's show a nice response instead
        Got me thinking, what was the first question ever asked on Stack Overflow? haha!
      */
      return res.status(200).json({
        message: m.nqRetrieved,
      });
    }
    return res.status(200).json({
      message: m.qsRetrieved,
      questions,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Get question by id */
// Update: I made this endpoint pseudo-private by modifying restrict middleware ...
router.get("/:id", restrict, v.validateQuestionId, async (req, res, next) => {
  try {
    /*
      Token will let us strip author-specific field(s) like
      'notification' from the question for a non-author
      Recall that at this point (if authenticated);
      we have access to the decodedToken in the req object
      Recall also that we have access to the question bearing the id;
     */
    const question = await controller.refine(req.question, req.decodedToken);
    return res.status(200).json({
      message: m.qRetrieved,
      question,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Post new question */
router.post("/", restrict, v.validateBody, v.validateQuestion, async (req, res, next) => {
  try {
    const savedQuestion = await controller.save({
      question: req.body.question,
      // At this point, we have access to the user's id from the decoded token
      userId: req.decodedToken.sub,
    });
    // Let's add more context to the question
    const question = await controller.refine(savedQuestion, req.decodedToken);
    return res.status(201).json({
      message: m.qCreated,
      question,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Upvote or Downvote a question */
router.post("/:id/vote", restrict, v.validateBody, v.validateQuestionId, v.validateVote, async (req, res, next) => {
  try {
    /*
      Recall that at this point, we have access to the question bearing the id;
    */
    await updater.vote(req.question, "question", req.body.type);
    return res.status(200).json({ message: m.voteUpdated });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Answer a question */
router.post("/:id/answer", restrict, v.validateBody, v.validateQuestionId, v.validateAnswer, async (req, res, next) => {
  try {
    /*
      At this point, having passed all middleware checks,
      we have access to;
       - the answer in the request body;
       - the userId from the decodedToken, now in the request object
       - the question to be answered, now in the request object
    */
    const { answer } = req.body;
    // Returned question is an instance of Mongoose Model
    const savedQuestionModel = await controller.saveAnswer(
      answer,
      req.decodedToken.sub,
      req.question,
    );
    // Let's add more context to the returned question object
    const question = await controller.refine(savedQuestionModel.toObject(), req.decodedToken);
    return res.status(201).json({
      message: m.aCreated,
      question,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

module.exports = router;
