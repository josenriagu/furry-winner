const express = require("express");

const controller = require("../controllers/question");

const { restrict } = require("../helpers/authenticators");
const { validateBody, validateQuestion, validateQuestionId } = require("../helpers/validators");
const m = require("../helpers/messageStrings");
const genError = require("../helpers/error");
const updater = require("../helpers/updater");

const router = express.Router();

/* Get all questions */
router.get("/", restrict, async (req, res, next) => {
  try {
    /* Token will let us strip author-specific field(s) like
     * 'notification' from the question for a non-author
     * Recall that at this point, we have access to the decodedToken in the req object
     */
    const questions = await controller.findAll(req.decodedToken);
    return res.status(200).json({
      message: m.qsRetrieved,
      questions,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Get question by id */
router.get("/:id", restrict, validateQuestionId, async (req, res, next) => {
  try {
    /* Token will let us strip author-specific field(s) like
     * 'notification' from the question for a non-author
     * Recall that at this point, we have access to the decodedToken in the   req object
     * Recall also that we have access to the question bearing the id;
     */
    const question = await controller.find(req.question, req.decodedToken);
    return res.status(200).json({
      message: m.qRetrieved,
      question,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Post new question */
router.post("/", restrict, validateBody, validateQuestion, async (req, res, next) => {
  try {
    const question = await controller.save({
      question: req.body.question,
      // At this point, we have access to the user's id from the decoded token
      userId: req.decodedToken.sub,
    });
    return res.status(201).json({
      message: m.qCreated,
      question,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Upvote or Downvote a question */
router.post("/:id/vote", restrict, validateBody, validateQuestionId, async (req, res, next) => {
  try {
    const { type } = req.body;
    if (type && (type === "up" || type === "down")) {
      /* Recall that at this point, we have access to the question bearing the id;
       */
      await updater.vote(req.question, "question", req.body.type);
      return res.status(200).json({ message: m.voteUpdated });
    }
    if (type && type !== "up" && type !== "down") {
      return next(genError(400, m.invalidType));
    }
    return next(genError(400, m.missingFields));
  } catch (error) {
    return next(genError(500, error.message));
  }
});

module.exports = router;
