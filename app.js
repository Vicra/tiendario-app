const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const hbs = require("hbs");
const session = require("express-session");

const index = require("./routes/index");
const account = require("./routes/account");
const admin = require("./routes/admin");
const cart = require("./routes/cart");

const app = express();

app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("../uploads"));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use("/", index);
app.use("/", account);
app.use("/", admin);
app.use("/", cart);

app.use(function (_, _, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, _) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
