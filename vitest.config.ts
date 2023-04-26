import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
    root: "./test",
    include: ["**/*.{test,spec,e2e-test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
