import compression from "compression";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import actuator from "express-actuator";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes";

const app = express();
///LOGGER
app.use(morgan("combined"));

///All Importatn Middlewares Goes Here
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(
  actuator({
    basePath: "/actuator",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.enable("etag");
//Error Handler For Whole Application
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  //TODO Add Server Error Here
  console.error(err.stack);
  res.status(500).send("Internal Server Error!");
});

//////

//All Apis Goes Here
app.use("/api", apiRouter);

export default app;
