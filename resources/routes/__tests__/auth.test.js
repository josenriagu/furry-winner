/* eslint-disable no-undef */
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../../bin/www");
const connectionUri = require("../../../config/dbConfig");
const clearCollections = require("../../helpers/testDbCleanup");

beforeAll(async (done) => {
  // Establishes a Mongoose connection
  try {
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
    server = app.listen(4000, () => {
      global.agent = request.agent(server);
      done();
    });
  } catch (error) {
    console.log(`Connection to database failed: ${error.message}`);
  }
});

afterEach(async () => {
  /* This line drops all collections in the Test DB
   * after each test
   */
  await clearCollections();
});

afterAll(async (done) => {
  // Closes the Mongoose connection
  await mongoose.connection.close();
  await server.close(done);
});

describe("Auth Register Route Tests", () => {
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
    done();
  });
});

describe("Auth Login Route Tests", () => {
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
     */
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        displayName: "Test 1",
        email: "test1@email.com",
        password: "password",
      });
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
