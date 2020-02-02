/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB, getToken, createQuestion } = require("../../helpers/testSetup");

setupTestDB();

describe("POST Question Route Tests", () => {
  it("throws error if no token is supplied", async (done) => {
    const res = await request(app)
      .post("/api/v1/questions")
      .send({
        question: "Question 1?",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if request body is empty", async (done) => {
    const token = await getToken();
    const res = await request(app)
      .post("/api/v1/questions")
      .set("Authorization", token)
      .send({});
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if one or more required fields are missing", async (done) => {
    const token = await getToken();
    const res = await request(app)
      .post("/api/v1/questions")
      .set("Authorization", token)
      .send({
        hello: "hi",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if question length is less than 2", async (done) => {
    const token = await getToken();
    const res = await request(app)
      .post("/api/v1/questions")
      .set("Authorization", token)
      .send({
        question: "h",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if question already exists", async (done) => {
    // This line creates a question in the db and will trigger unique middleware
    const { token } = await createQuestion();
    const res = await request(app)
      .post("/api/v1/questions")
      .set("Authorization", token)
      .send({
        question: "Question 1?",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(403);
    done();
  });
  it("posts a new question with user token", async (done) => {
    const token = await getToken();
    const res = await request(app)
      .post("/api/v1/questions")
      .set("Authorization", token)
      .send({
        question: "Question 1?",
      });
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(201);
    done();
  });
});
