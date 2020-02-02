/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB, createQuestion } = require("../../helpers/testSetup");

setupTestDB();

describe("POST Question Vote Endpoint Tests", () => {
  it("throws error if missing one or more required fields", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    const res = await request(app)
      .post(`/api/v1/questions/${id}/vote`)
      .set("Authorization", token)
      .send({
        vote: "up",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if invalid vote type", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    const res = await request(app)
      .post(`/api/v1/questions/${id}/vote`)
      .set("Authorization", token)
      .send({
        type: "upvote",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("votes a question correctly", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    // Next, let's upvote the question twice and downvote once
    await request(app)
      .post(`/api/v1/questions/${id}/vote`)
      .set("Authorization", token)
      .send({
        type: "up",
      });
    await request(app)
      .post(`/api/v1/questions/${id}/vote`)
      .set("Authorization", token)
      .send({
        type: "up",
      });
    await request(app)
      .post(`/api/v1/questions/${id}/vote`)
      .set("Authorization", token)
      .send({
        type: "down",
      });
    // Now, let's query the question, should have 1 vote now
    const res = await request(app).get(`/api/v1/questions/${id}`);
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(200);
    expect(res.body.question.votes).toEqual(1);
    done();
  });
});
