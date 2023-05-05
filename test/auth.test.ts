import { describe, expect, it } from "vitest";
import { api } from "./helpers";
import { faker } from "@faker-js/faker";
const ITFails = "❌";
const ITWorks = "✅";

describe("Auth Test", () => {
  const username = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const confirmPassword = password;
  const otp = "111111";
  let refreshToken = "";
  let accessToken = "";
  let oldRefreshToken = "";

  it("Login With Wrong User " + ITFails, async () => {
    const res = await api().post("/api/auth/login").send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    expect(res.status).toBe(403);
  });

  it("Login With Wrong Data " + ITFails, async () => {
    const res = await api().post("/api/auth/login").send({
      email: faker.internet.email(),
    });
    expect(res.status).toBe(400);
  });

  it("Register User Passwords Do Not Match " + ITFails, async () => {
    const res = await api().post("/api/auth/register").send({
      email,
      password,
      username,
      confirmPassword: faker.internet.password(),
    });
    expect(res.status).toBe(400);
  });

  it("Register User " + ITWorks, async () => {
    const res = await api().post("/api/auth/register").send({
      email,
      password,
      username,
      confirmPassword,
    });
    expect(res.status).toBe(201);
  });

  it("Verify User " + ITFails, async () => {
    const res = await api().post("/api/auth/verify-otp").send({
      email,
      otp: "111112",
    });
    expect(res.status).toBe(403);
  });

  it("Verify User " + ITWorks, async () => {
    const res = await api().post("/api/auth/verify-otp").send({
      email,
      otp: otp,
    });
    expect(res.status).toBe(200);
  });
  it("Register Same User Again" + ITFails, async () => {
    const res = await api().post("/api/auth/register").send({
      email,
      password,
      username,
      confirmPassword,
    });
    expect(res.status).toBe(409);
  });
  it("Log In Same User " + ITWorks, async () => {
    const res = await api().post("/api/auth/login").send({
      email,
      password,
    });
    refreshToken = res.body.data.refreshToken;
    accessToken = res.body.data.accessToken;
    oldRefreshToken = refreshToken;
    expect(res.status).toBe(200);
  });
  it("Refresh Token " + ITWorks, async () => {
    const res = await api().post("/api/auth/refresh-token").send({
      refreshToken,
    });
    refreshToken = res.body.data.refreshToken;
    expect(res.body.data.accessToken).not.toBe(accessToken);
    expect(res.status).toBe(200);
  });
  it("Old Refresh Token " + ITFails, async () => {
    const res = await api().post("/api/auth/refresh-token").send({
      refreshToken: oldRefreshToken,
    });
    expect(res.status).toBe(403);
  });

  it("Log Out " + ITWorks, async () => {
    const res = await api().post("/api/auth/logout").send({
      refreshToken,
    });
    expect(res.status).toBe(200);
  });
  it("Cannot Reefresh With Token Again " + ITWorks, async () => {
    const res = await api().post("/api/auth/refresh-token").send({
      refreshToken,
    });
    expect(res.status).toBe(403);
  });
});
