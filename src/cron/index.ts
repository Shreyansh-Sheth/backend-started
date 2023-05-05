import { CronJob } from "cron";
import { HelloJob } from "./hello";

export const SetupCron = () => {
  console.log("Setting up cron jobs");
  //All cron jobs are defined here
  // new CronJob("*/5 * * * * *", HelloJob).start();
};
