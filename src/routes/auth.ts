import { Router } from "express";
import db from "../utils/db";
import RandomOtp from "../utils/randomOtp";
import { getTokens } from "../utils/token";
import { validateRequestBody } from "../utils/validate-request";
import { authValidation } from "../validations/index";
const authRouter = Router();

authRouter.post(
  "/register",
  validateRequestBody(authValidation.registerSchema),
  async (req, res) => {
    try {
      await db.$transaction(async (tx) => {
        const dbUser = await tx.emailPassword.findFirst({
          where: {
            email: req.body.email,
          },
          include: {
            provider: true,
          },
        });

        if (dbUser && dbUser.verified) {
          return res.status(409).json({
            message: "Email already exists",
          });
        }
        if (dbUser && !dbUser.verified) {
          await tx.user.delete({
            where: {
              id: dbUser.provider.userId,
            },
          });
        }
        await tx.user.create({
          data: {
            Provider: {
              create: {
                EmailPassword: {
                  create: {
                    email: req.body.email,
                    password: req.body.password,
                    verified: false,
                    code: RandomOtp(),
                  },
                },
                type: "EMAIL_PASSWORD",
              },
            },
          },
        });
        return res.status(201).json({
          message: "User Created",
        });
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
);

authRouter.post(
  "/login",
  validateRequestBody(authValidation.loginSchema),
  async (req, res) => {
    await db.$transaction(async (tx) => {
      const user = await tx.emailPassword.findFirst({
        where: {
          email: req.body.email,
          password: req.body.password,
        },
        include: {
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return res.status(403).json({
          message: "Invalid Credentials",
        });
      }
      const tokens = await getTokens({
        id: user.provider.user.id,
      });
      res.status(200).json({
        message: "Login Successful",
        data: tokens,
      });
    });
  }
);

authRouter.post(
  "/verify-otp",
  validateRequestBody(authValidation.verifyOtpSchema),
  async (req, res) => {
    await db.$transaction(async (tx) => {
      const provider = await tx.provider.findFirst({
        where: {
          type: "EMAIL_PASSWORD",
          EmailPassword: {
            email: req.body.email,
            code: req.body.otp,
          },
        },
      });
      if (!provider) {
        return res.status(403).json({
          message: "Invalid OTP",
        });
      }

      const userData = await tx.emailPassword.update({
        where: {
          email: req.body.email,
        },
        data: {
          verified: true,
          code: null,
        },
        include: {
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const tokens = await getTokens({
        id: userData.provider.user.id,
      });
      res.status(200).json({
        message: "OTP Verified",
        data: tokens,
      });
      //
    });
  }
);

export default authRouter;
