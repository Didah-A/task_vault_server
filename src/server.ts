import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/logging";

const router = express();

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

  router.get("/ping", (_req, res) => res.status(200).json({ message: "live" }));

  router.use((req, res, next) => {
    const error = new Error("Offline");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`)
    );
};
