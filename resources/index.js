const express = require("express");

const { validateBody, validateEmail, validateUser, validateQuery } = require("./helpers/validators");

const mainRouter = express.Router();
const auth = require("./routes/auth");
const question = require("./routes/question");
const search = require("./routes/search");

/* GET home page */
mainRouter.get("/", (req, res) => {
  res.status(200).render("index", {
    title:
      "Stack Overflow Clone - Where Developers Learn, Share, & Build Careers",
    heading: "Stack Overflow Clone",
    seat: "seat",
    coffee: "coffee",
  });
});

/* Use middleware for other routes */
mainRouter.use("/api/v1/auth", validateBody, validateEmail, validateUser, auth);
mainRouter.use("/api/v1/questions", question);
mainRouter.use("/api/v1/search", validateQuery, search);

module.exports = mainRouter;
