/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB, createQuestion } = require("../../helpers/testSetup");

setupTestDB();

describe("POST Question Answer Endpoint Tests", () => {
  it("throws an error if author tries to answer their question", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    // Now, let's answer the question
    const res = await request(app)
      .post(`/api/v1/questions/${id}/answer`)
      .set("Authorization", token)
      .send({
        answer: "Answer 1",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(403);
    done();
  });
  it("posts an answer to a question", async (done) => {
    // Create a question and get the id
    const { id } = await createQuestion();
    // Next, since an author may not answer their own question, let's create a fresh new user
    const resp = await request(app)
      .post("/api/v1/auth/register")
      .send({
        displayName: "Test 2",
        email: "test2@email.com",
        password: "password",
      });
    // Get the new user's token
    const token = resp.body.user.token;
    // Now, let's answer the question
    const res = await request(app)
      .post(`/api/v1/questions/${id}/answer`)
      .set("Authorization", token)
      .send({
        answer: "Answer 1",
      });
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(201);
    // Now let's assert the answers array
    expect(res.body.question.answers.length).toEqual(1);
    expect(res.body.question.answers[0].answer).toEqual("Answer 1");
    done();
  });
});
