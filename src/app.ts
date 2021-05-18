import express from "express";
// import swaggerDoc from "../swagger.json";
import {errorHandler} from "./middleware/errorHandlers";
import loggerHandler from "./middleware/loggerHandler";
import address from "./router/address";

const app = express();

app.set("etag", "strong"); // use strong etag
app.use(loggerHandler);

app.use("/address", address());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);
// app.use(notFoundHandler);

export default app;
