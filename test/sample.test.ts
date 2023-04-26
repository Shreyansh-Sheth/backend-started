import app from "../src/app";
import { beforeEach, describe, it } from "vitest";
import request from "supertest";
describe("Main Test For ALl", () => {
  let api: request.SuperTest<request.Test>;

  beforeEach(() => {
    api = request(app);
  });

  it("Hello World", async () => {
    api.get("/").expect(200);
  });
});
