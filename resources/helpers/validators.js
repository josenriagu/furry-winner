const bcrypt = require('bcryptjs');

const UserModel = require("../models/user");

const genError = require("./error");
const m = require("./messageStrings");
const modUser = require("../helpers/modUser");

module.exports = {
  validateBody(req, res, next) {
    if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      next();
    } else {
      next(genError(400, m.noUserData));
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
    const user = email !== undefined ? await (await UserModel.findOne({ email })) : null;
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
};
