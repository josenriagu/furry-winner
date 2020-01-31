const express = require("express");
const bcrypt = require("bcryptjs");

const controller = require("../controllers/auth");

const { regWelcome, loginWelcome } = require("../helpers/messageStrings");
const genError = require("../helpers/error");

const router = express.Router();

/* Register new user */
router.post("/register", async (req, res, next) => {
  // Hash user password using bcrypt
  const hashed = bcrypt.hashSync(req.body.password, 12);
  req.body.password = hashed;
  try {
    const { displayName, email, password } = req.body;
    const user = await controller.save({ displayName, email, password });
    return res.status(201).json({
      message: regWelcome(displayName),
      user,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

/* Log in existing user */
router.post("/login", (req, res, next) => {
  try {
    // At this point, we can access the user object, if it passess all middleware checks
    const user = controller.login(req.user);
    return res.status(200).json({
      message: loginWelcome(req.user.displayName),
      user,
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

module.exports = router;
