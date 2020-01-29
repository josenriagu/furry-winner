/* eslint-disable no-undef */
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../www");
const connectionUri = require("../../config/dbConfig");

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

afterAll(async (done) => {
  // Closes the Mongoose connection
  await mongoose.connection.close();
  await server.close(done);
});

describe("Base Url Tests", () => {
  it("gets base URL and responds with html", async (done) => {
    const res = await request(app).get("/");
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(200);
    done();
  });
  it("returns 404 error page when wrong url is requested on the base", async (done) => {
    const res = await request(app).get("/hello");
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(404);
    done();
  });
});
