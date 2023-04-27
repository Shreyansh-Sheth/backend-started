import { sign, verify } from "jsonwebtoken";
import config from "./config";
export type AccessTokenPayloadType = {
  sub: string;
};

export type RefreshTokenPayloadType = {
  sub: string;
};
type PayloadType = AccessTokenPayloadType & RefreshTokenPayloadType;

export const getTokens = (payload: PayloadType) => {
  const accessToken = signAccessToken({
    sub: payload.sub,
  });
  const refreshToken = signRefreshToken({
    sub: payload.sub,
  });
  return { accessToken, refreshToken };
};

const signToken = (payload: any, secret: string, expiry: string) => {
  return sign(payload, secret, { expiresIn: expiry });
};

const verifyToken = <T>(token: string, secret: string) => {
  return verify(token, secret) as T;
};

const signAccessToken = (payload: AccessTokenPayloadType) => {
  return signToken(
    payload,
    config.ACCESS_TOKEN_SECRET,
    config.ACCESS_TOKEN_EXPIRY
  );
};
const signRefreshToken = (payload: RefreshTokenPayloadType) => {
  return signToken(
    payload,
    config.REFRESH_TOKEN_SECRET,
    config.REFRESH_TOKEN_EXPIRY
  );
};

export const verifyAccessToken = (token: string) => {
  return verifyToken<AccessTokenPayloadType>(token, config.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return verifyToken<RefreshTokenPayloadType>(
    token,
    config.REFRESH_TOKEN_SECRET
  );
};
