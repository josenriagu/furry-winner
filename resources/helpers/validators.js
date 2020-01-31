const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const QuestionModel = require("../models/question");

const genError = require("./error");
const m = require("./messageStrings");
const modUser = require("../helpers/modUser");

module.exports = {
  validateBody(req, res, next) {
    if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      next();
    } else {
      next(genError(400, m.noData));
    }
  },

  validateEmail(req, res, next) {
    const { email } = req.body;
    if (m.mailRegex.test(email)) {
      next();
    } else {
      next(genError(400, m.invalidEmail));
    }
  },
  async validateUser(req, res, next) {
    const { displayName, email, password } = req.body;
    /* this ternary operator is added as a
      fallback in a rare case where login req body is supplied without an email
    */
    const user = email !== undefined ? await UserModel.findOne({ email }) : null;
    if (displayName && email && password && req.path === "/register") {
      if (user === null) {
        next();
      } else {
        next(genError(403, m.alreadyInUse));
      }
    } else if (email && password && req.path === "/login") {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.user = modUser(user.toObject());
        next();
      } else {
        next(genError(401, m.invalid));
      }
    } else {
      next(genError(400, m.missingFields));
    }
  },
  async validateQuestion(req, res, next) {
    const { question } = req.body;
    if (question && question.length >= 2) {
      const questionExists = await QuestionModel.findOne({ question });
      if (questionExists === null) {
        next();
      } else {
        next(genError(403, m.qExists));
      }
    } else if (question && question.length < 2) {
      next(genError(400, m.tooShort));
    } else {
      next(genError(400, m.missingFields));
    }
  },
  async validateQuestionId(req, res, next) {
    const { id } = req.params;
    const question = await QuestionModel.findById(id, (err, doc) => {
      if (err) {
        // At this point, we most likely got an error message
        next(genError(400, m.invalidId));
      }
      return doc;
    });
    if (question !== null) {
      // At this point, question returned a valid doc model
      req.question = question.toObject();
      next();
    } else {
      // At this point, question did not find the id and returned null as doc
      next(genError(404));
    }
  },
};
