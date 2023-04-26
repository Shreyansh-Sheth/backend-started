import { Router } from "express";
import { z } from "zod";
import isUserAllowed from "../middleware/isUserAllowed";
import { validateRequestBody } from "../utils/validate-request";
import authRouter from "./auth";
const router = Router();
router.get("/", (req, res) => {});
router.use("/auth", authRouter);

router.get(
  "/",
  validateRequestBody(
    z.object({
      name: z.string(),
    })
  ),
  isUserAllowed(),
  (req, res) => {}
);

export default router;
