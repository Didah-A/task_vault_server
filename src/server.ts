import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/logging";
import userRoutes from "./routes/userRoutes";
import TaskRoutes from "./routes/taskRoutes";

const router = express();

/** Mongo DB database connection setup */
mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: "majority",
    dbName: config.mongo.db,
  })
  .then(() => {
    Logging.info("database connected successfully");
    startServer();
  })
  .catch((error) => {
    Logging.error(error);
  });

const startServer = () => {
  /** Request Logging */
  router.use((req, res, next) => {
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
    res.on("finish", () => {
      Logging.info(
        `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /**  Api Rules */
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "origin , X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  /** Routes */
  router.use("/api/users", userRoutes);
  router.use("/api/tasks", TaskRoutes);

  /** API healthcheck */
  router.get("/ping", (_req, res) => res.status(200).json({ message: "live" }));

  /** Route error handling */
  router.use((req, res, next) => {
    const endpoint = req.path;
    const error = new Error(`Endpoint <${req.path}> not found!`);
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  /** API server init */
  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`)
    );
};
