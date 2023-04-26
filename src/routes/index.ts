import { Router } from "express";
import authRouter from "./auth";
import onlyUserAllowed from "../middleware/onlyUserAllowed";
const router = Router();

router.use("/auth", authRouter);

router.get("/", onlyUserAllowed(), (req, res) => {
  res.json({
    data: {
      message: "Hello World From Protected Route",
    },
  });
});
export default router;
