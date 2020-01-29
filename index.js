require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");

const connectDB = require("./database");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // res.status(err.status || 500);
  if (err.status === 404) {
    res.render("404", { title: `${err.status}: ${err.message}`, error: err });
  } else if (err.status === 500) {
    res.render("500", { title: `${err.status}: ${err.message}`, error: err });
  } else {
    res.render("error", { title: `${err.status}: ${err.message}`, error: err });
  }
});

module.exports = app;
