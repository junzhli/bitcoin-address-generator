import app from "./app";
// import db from "./lib/db";
import logger from "./lib/logger";

const log = logger("app");

const port = process.env.PORT || 8080;
app.listen(port, () =>
    log.info(`bitcoin-address-generator project listening on port ${port}!`)
);