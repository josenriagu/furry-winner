/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../../bin/www");
const { setupTestDB, getToken } = require("../../helpers/testSetup");

setupTestDB();

describe("Auth Login Endpoint Tests", () => {
  it("throws error if request body is empty", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({});
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if email address format is not valid", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/login")
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
      .post("/api/v1/auth/login")
      .send({
        email: "test1@email.com",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(400);
    done();
  });
  it("throws error if credentials are invalid", async (done) => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@email.com",
        password: "password",
      });
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(401);
    done();
  });
  it("returns an existing user", async (done) => {
    /*
     * Since DB is cleared after each test, we may want
     * to create a fresh user and attempt logging in
     * We can invoke the getToken helper, to do this.
     */
    await getToken();
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test1@email.com",
        password: "password",
      });
    expect(res.type).toMatch(/json/);
    expect(res.status).toEqual(200);
    done();
  });
});
