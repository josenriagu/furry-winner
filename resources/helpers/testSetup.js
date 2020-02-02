/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../bin/www");
const connectionUri = require("../../config/dbConfig");
// Import Db cleaner helper modules
const { removeAllCollections, dropAllCollections } = require("./dbCleanup");

async function getToken() {
  // We need to create a user so as to be able to use token for tests requiring them
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      displayName: "Test 1",
      email: "test1@email.com",
      password: "password",
    });
  return res.body.user.token;
}

async function createQuestion() {
  // We also need to create arbitrary question, to be able to trigger unique question middleware
  const token = await getToken();
  const res = await request(app)
    .post("/api/v1/questions")
    .set("Authorization", token)
    .send({
      question: "Question 1?",
    });
  const id = res.body.question._id;
  return { token, id };
}

async function createQuestions() {
  const token = await getToken();
  // Let's create three questions and assert the length where needed
  await request(app)
    .post("/api/v1/questions")
    .set("Authorization", token)
    .send({
      question: "Question 1?",
    });
  await request(app)
    .post("/api/v1/questions")
    .set("Authorization", token)
    .send({
      question: "Question 2?",
    });
  await request(app)
    .post("/api/v1/questions")
    .set("Authorization", token)
    .send({
      question: "Question 3?",
    });
  return token;
}

module.exports = {
  setupTestDB() {
    beforeAll(async (done) => {
      // Establishes a Mongoose connection
      try {
        await mongoose.connect(connectionUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        server = app.listen(4000, () => {
          global.agent = request.agent(server);
          done();
        });
      } catch (error) {
        console.log(`Connection to database failed: ${error.message}`);
      }
    });

    afterEach(async () => {
      /* This line cleans up the Test DB
       * after each test
       */
      await removeAllCollections();
    });

    afterAll(async (done) => {
      // Closes the Mongoose connection
      await dropAllCollections();
      await mongoose.connection.close();
      await server.close(done);
    });
  },
  getToken,
  createQuestion,
  createQuestions,
};
