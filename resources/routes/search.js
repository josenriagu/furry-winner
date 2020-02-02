const express = require("express");
const paginate = require("express-paginate");

const controller = require("../controllers/search");
const qController = require("../controllers/question");

const m = require("../helpers/messageStrings");
const genError = require("../helpers/error");

const router = express.Router();

/*
  This line tells router to use paginate middleware
  then set default limit to 10 if not explicitly specified in the request query
*/
router.use(paginate.middleware(10, 50));

router.get("/", async (req, res, next) => {
  try {
    const [modResults, usersCount, usersPageCount] = await controller.searchUsers(req);

    const [questionsArr, questionsCount, questionPageCount] = await qController.findAll(req);
    return res.status(200).json({
      message: m.sCompleted,
      users: {
        pageCount: usersPageCount,
        itemCount: usersCount,
        pages: paginate.getArrayPages(req)(3, usersPageCount, req.query.page),
        has_more: paginate.hasNextPages(req)(usersPageCount),
        matched: modResults,
      },
      questions: {
        pageCount: questionPageCount,
        itemCount: questionsCount,
        pages: paginate.getArrayPages(req)(3, questionPageCount, req.query.page),
        has_more: paginate.hasNextPages(req)(questionPageCount),
        matched: questionsArr,
      },
    });
  } catch (error) {
    return next(genError(500, error.message));
  }
});

module.exports = router;
