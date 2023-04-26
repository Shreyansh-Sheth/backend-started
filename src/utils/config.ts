import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config({});

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
console.log(config);
export default config;
