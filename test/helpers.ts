import app from "../src/app";
import request from "supertest";

export const api = () => {
  //TODO add apis with auth
  return request(app);
};
