import { describe, it } from "vitest";
import { api } from "./helpers";
describe("Main Test For ALl", () => {
  it("Hello World", async () => {
    api().get("/").expect(200);
  });
});
