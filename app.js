//Imports
require("dotenv-extended").load();
var express = require("express");
var path = require("path");
var parser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var expressLayouts = require("express-ejs-layouts");
var flash = require("connect-flash");
var morgan = require("morgan");

// basic setup
var app = express();
var port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
//app.set('view options', { layout: 'layout.ejs' });

app.use(express.static("static"));
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(morgan("dev"));

app.use(
  session({
    secret: "Blog-App",
    saveUninitialized: true,
    resave: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash messages

app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
if (process.env.STAGE != "dev") {
  app.use(function(req, res, next) {
    if (req.get("X-Forwarded-Proto") !== "https") {
      res.redirect("https://" + req.get("Host") + req.url);
    } else next();
  });
}

// require files
var indexRouter = require("./routes/indexRouter");
var loginRouter = require("./routes/loginRouter");
var notesRouter = require("./routes/notesRouter");
var signupRouter = require("./routes/signupRouter");
var profileRouter = require("./routes/profileRouter");

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/notes", notesRouter);
app.use("/signup", signupRouter);
app.use("/profile", profileRouter);

app.listen(port, function(error) {
  console.log("Server running on port " + port);
});
