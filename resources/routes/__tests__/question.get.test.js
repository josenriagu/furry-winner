/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const {
  setupTestDB, getToken,
  createQuestions,
  createQuestion,
} = require("../../helpers/testSetup");
const QuestionModel = require("../../models/question");

setupTestDB();

describe("GET Question Route Tests", () => {
  it("throws error if no token is supplied", async (done) => {
    const res = await request(app).get("/api/v1/questions");
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("gets all questions", async (done) => {
    const token = await createQuestions();
    const res = await request(app)
      .get("/api/v1/questions")
      .set("Authorization", token);
    console.log(res.body.questions[0]._id);
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(200);
    // Since we created 3 questions in our helper module, let's assert the length;
    expect(res.body.questions.length).toEqual(3);
    done();
  });
});
