/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB } = require("../../helpers/testSetup");

setupTestDB();

describe("Auth Register Endpoint Tests", () => {
  it("throws error if request body is empty", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({});
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if email address format is not valid", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        displayName: "Test 1",
        email: "test1@email",
        password: "password",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if one or more required fields are missing", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test1@email.com",
        password: "password",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("saves user to database", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        displayName: "Test 1",
        email: "test1@email.com",
        password: "password",
      });
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(201);
    expect(res.body.user.email).toEqual("test1@email.com");
    done();
  });
});
