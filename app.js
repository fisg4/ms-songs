const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const songsRouter = require("./routes/songs");
const likesRouter = require("./routes/likes");

const DB_URL = process.env.DB_URL || "mongodb://localhost/test";
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error"));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/songs", songsRouter);
app.use("/api/v1/likes", likesRouter);

module.exports = app;
