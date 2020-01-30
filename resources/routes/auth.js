const express = require("express");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const modUser = require("../helpers/modUser");
const { generateToken } = require("../helpers/authenticators");
const { regWelcome, loginWelcome } = require("../helpers/messageStrings");
const genError = require("../helpers/error");

const router = express.Router();

/* Register new user */
router.post("/register", async (req, res, next) => {
  // Hash user password using bcrypt
  const hashed = bcrypt.hashSync(req.body.password, 14);
  req.body.password = hashed;
  try {
    const { displayName, email, password } = req.body;
    const newUser = new UserModel({
      displayName,
      email,
      password,
    });
    await newUser.save();
    const user = modUser(newUser.toObject());
    const token = await generateToken(user);
    user.token = token;
    res.status(201).json({
      message: regWelcome(displayName),
      user,
    });
  } catch (error) {
    next(genError(500, error.message));
  }
});

/* Log in existing user */
router.post("/login", (req, res, next) => {
  try {
    // At this point, we can access the user object, if it passess all middleware checks
    const token = generateToken(req.user);
    req.user.token = token;
    res.status(200).json({
      message: loginWelcome(req.user.displayName),
      user: req.user,
    });
  } catch (error) {
    next(genError(500, error.message));
  }
});

module.exports = router;
