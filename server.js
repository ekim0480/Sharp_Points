// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Dependencies
// =============================================================
var express = require("express");

// Requiring our models for syncing
const db = require("./models");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
var passport = require("passport");
var session = require("express-session");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// For Passport
app.use(cookieParser())
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge:3600000*24}
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Static directory
app.use(express.static("public"));

//load passport strategies
require("./config/passport/passport.js")(passport, db.user);

// Routes
// =============================================================
require("./routes/customer-api-routes.js")(app);
require("./routes/sale-api-routes.js")(app);
require("./routes/html-routes.js")(app, passport);
// require("./routes/auth.js")(app,passport)

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
