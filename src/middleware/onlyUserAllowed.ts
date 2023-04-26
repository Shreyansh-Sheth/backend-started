import { ParamsDictionary } from "express-serve-static-core";
import { AccessTokenPayloadType, verifyAccessToken } from "../utils/token";
import type { RequestHandler } from "express";

// export declare type TypedRequest = Request<any, any, any, any>;

const onlyUserAllowed = () => {
  const authMiddleware: RequestHandlerWithChangedParams = (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
          code: 401,
        },
      });
    }

    const jwt = token.split(" ")[1];
    if (!jwt) {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
          code: 401,
        },
      });
    }

    try {
      const payload = verifyAccessToken(jwt);
      res.locals.user = payload;
      //TODO verify role based on access token
      next();
    } catch {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
          code: 401,
        },
      });
    }
  };
  return authMiddleware;
};

export default onlyUserAllowed;

type user = AccessTokenPayloadType;

type GenericRequestHandler = RequestHandler<ParamsDictionary, any, any, any>;
type ResponseWithUser = Parameters<GenericRequestHandler>[1] & {
  locals: {
    user: user;
  };
};
type RequestHandlerWithChangedParams = (
  req: Parameters<GenericRequestHandler>[0],
  res: ResponseWithUser,
  next: Parameters<GenericRequestHandler>[2]
) => void;
