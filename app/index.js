const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const winston = require("winston");
require("winston-mongodb");
const ErrorMiddleware = require("./http/middleware/Error");

const app = express();

class Application {
  constructor() {
    this.setupExpressServer();
    this.setupMongoose();
    this.setupRoutesAndMiddlewares();
    this.setupConfigs();
  }

  setupRoutesAndMiddlewares() {
    // built-in middlwares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));

    if (app.get("env") === "production") app.use(morgan("tiny"));

    // third-party middlewares
    app.use(cors());

    // routes

    app.use(ErrorMiddleware);
  }

  setupConfigs() {
    winston.add(new winston.transports.File({ filename: "error-log.log" }));

    winston.add(
      new winston.transports.MongoDB({
        db: "mongodb://localhost:27017/quickdish",
        level: "error",
      })
    );

    process.on("uncaughtException", (error) => {
      console.log(error);
      winston.error(error.message);
    });

    process.on("unhandledRejection", (error) => {
      console.log(error);
      winston.error(error.message);
    });

    app.set("view engine", "pug");
    app.set("views", "../views");
  }

  setupMongoose() {
    mongoose
      .connect("mongodb://localhost:27017/quickdish", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("db connected");
        winston.info("db connected");
      })
      .catch((error) => {
        console.log("db not connnected", error);
      });
  }

  setupExpressServer() {
    const port = process.env.myPort || 3000;
    app.listen(port, (error) => {
      if (error) console.log(error);
      else console.log(`app listen to port ${port}`);
    });
  }
}

module.exports = Application;
