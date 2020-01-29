/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../www");

describe("Base Url Tests", () => {
  it("gets base URL and responds with html", async () => {
    const res = await request(app).get("/");
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(200);
  });
  it("returns 404 error page when wrong url is requested on the base", async () => {
    const res = await request(app).get("/hello");
    expect(res.type).toMatch(/html/);
    expect(res.status).toEqual(404);
  });
});
