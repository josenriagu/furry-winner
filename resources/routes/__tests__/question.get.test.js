/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const m = require("../../helpers/messageStrings");
const { setupTestDB, getToken, createQuestions } = require("../../helpers/testSetup");

setupTestDB();

describe("GET Question Route Tests", () => {
  it("returns a message if no question yet", async (done) => {
    const res = await request(app).get("/api/v1/questions");
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(200);
    expect(res.body.message).toMatch(m.nqRetrieved);
    done();
  });
  it("gets all questions", async (done) => {
    const token = await createQuestions();
    const res = await request(app).get("/api/v1/questions");
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(200);
    // Since we created 3 questions in our helper module, let's assert the length;
    expect(res.body.questions.length).toEqual(3);
    done();
  });
});
