import { faker } from "@faker-js/faker";
import app from "../src/app";
import request from "supertest";

export const api = () => {
  //TODO add apis with auth
  return request(app);
};

export const getTokens = async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const username = faker.internet.userName();
  const confirmPassword = password;
  const otp = "111111";
  //Register
  await api().post("/api/auth/register").send({
    email,
    password,
    username,
    confirmPassword,
  });
  //verify-otp
  await api().post("/api/auth/verify-otp").send({
    email,
    otp,
  });

  //login
  const loginRes = await api().post("/api/auth/login").send({
    email,
    password,
  });
  return loginRes.body.data;
};
