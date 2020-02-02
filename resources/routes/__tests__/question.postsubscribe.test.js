/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB, createQuestion } = require("../../helpers/testSetup");

setupTestDB();

describe("POST Question Subscribe Endpoint Tests", () => {
  it("subscribes a user to a question", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    // Now, let's subscribe to the question
    const res = await request(app)
      .post(`/api/v1/questions/${id}/subscribe`)
      .set("Authorization", token);
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(201);
    done();
  });
  it("throws error if subscription already exists", async (done) => {
    // Create a question and get the id and author token
    const { token, id } = await createQuestion();
    // Now, let's subscribe to the question
    await request(app)
      .post(`/api/v1/questions/${id}/subscribe`)
      .set("Authorization", token);
    // Subscribing again to same question will trigger the middleware
    const res = await request(app)
      .post(`/api/v1/questions/${id}/subscribe`)
      .set("Authorization", token);
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(403);
    expect(res.error.text).toMatch(/You have already subscribed to this question/);
    done();
  });
});
