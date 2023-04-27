import { Router } from "express";
import db from "../utils/db";
import RandomOtp from "../utils/randomOtp";
import { getTokens } from "../utils/token";
import { validateRequestBody } from "../utils/validate-request";
import { LogoutValidation, RefreshTokenValidation } from "../validations/auth";
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
            error: {
              code: 409,
              message: "User already exists",
            },
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
          data: {
            message: "User created successfully",
          },
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
          error: {
            code: 403,
            message: "Invalid Credentials",
          },
        });
      }
      const tokens = await getTokens({
        sub: user.provider.user.id,
      });
      await tx.sessions.create({
        data: {
          refreshToken: tokens.refreshToken,
          userId: user.provider.user.id,
        },
      });

      res.status(200).json({
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
          error: {
            code: 403,
            message: "Invalid OTP",
          },
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
        sub: userData.provider.user.id,
      });
      await tx.sessions.create({
        data: {
          refreshToken: tokens.refreshToken,
          userId: userData.provider.user.id,
        },
      });

      res.status(200).json({
        data: tokens,
      });
      //
    });
  }
);

authRouter.post(
  "/logout",
  validateRequestBody(LogoutValidation),
  async (req, res) => {
    await db.sessions.update({
      where: {
        refreshToken: req.body.refreshToken,
      },
      data: {
        status: "INACTIVE",
      },
    });
    res.json({
      data: {
        message: "Logged out successfully",
      },
    });
  }
);
authRouter.post(
  "/refresh-tokens",
  validateRequestBody(RefreshTokenValidation),
  async (req, res) => {
    await db.$transaction(async (tx) => {
      const session = await tx.sessions.findFirst({
        where: {
          refreshToken: req.body.refreshToken,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!session) {
        return res.status(403).json({
          error: {
            code: 403,
            message: "Invalid refresh token",
          },
        });
      }
      if (session.status === "INACTIVE") {
        //NOTE: Security measure to prevent replay attacks
        await tx.sessions.updateMany({
          where: {
            userId: session.user.id,
            status: "ACTIVE",
          },
          data: {
            status: "INACTIVE",
          },
        });
        res.status(403).json({
          error: {
            code: 403,
            message: "Invalid refresh token",
          },
        });
      }

      const tokens = await getTokens({
        sub: session.user.id,
      });
      await tx.sessions.create({
        data: {
          refreshToken: tokens.refreshToken,
          userId: session.user.id,
        },
      });

      //Make Old Token Inactive So No One Can Use It Again
      await tx.sessions.update({
        where: {
          refreshToken: req.body.refreshToken,
        },
        data: {
          status: "INACTIVE",
        },
      });
      res.status(200).json({
        data: tokens,
      });
    });
  }
);
export default authRouter;
