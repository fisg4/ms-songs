require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const dbConnect = require("./db");
const passport = require("./passport");
const songsRouter = require("./routes/songs");
const likesRouter = require("./routes/likes");
const { swaggerDocs } = require("./swagger");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

app.use("/api/v1/songs", songsRouter);
app.use("/api/v1/likes", likesRouter);
swaggerDocs(app);

dbConnect().then(() => {
  console.log("⚡️ Database connect well done!");
});

module.exports = app;
