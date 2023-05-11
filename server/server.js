const express = require("express");
const app = express();
require("express-ws")(app);
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./logger");
const fileUpload = require("express-fileupload");
const path = require("path");

const connection_string = "mongodb://localhost:27017/accident-detection";

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    (req.method === "POST" || req.method === "PATCH" || req.method === "PUT")
  ) {
    res.status(400).json({
      error: `${error.name} - ${error.message}`,
    });
  } else {
    next();
  }
});

global.__basedir = __dirname;

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", require("./routes"));

// app.get("*", (req, res) => res.status(404).json({ error: "404 - not found" }));

mongoose.set("strictQuery", false);

mongoose.connection.on("error", (error) =>
  logger.error("DB connection: error", error)
);

mongoose.connect(connection_string).catch((error) => {
  logger.error("Error connecting to DB", error);
});

mongoose.connection.once("open", () => {
  logger.info("Connected to Database");
  app.listen(4050, "0.0.0.0", () => {
    logger.info(`HTTP-Server Started - Listening on port 4050`);
  });
});
