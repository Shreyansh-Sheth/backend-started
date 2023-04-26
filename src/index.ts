import app from "./app";
import { SetupCron } from "./cron";
import config from "./utils/config";

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

SetupCron();
