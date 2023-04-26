import { z } from "zod";
// This Files Adds All The Config That This Projects Needs
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
  debug: true,
});

const configValidation = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().positive(),
  //
  DATABASE_URL: z.string(),
  //
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
});
const config = configValidation.parse(process.env);

export default config;
