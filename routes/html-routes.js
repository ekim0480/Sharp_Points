// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var passport = require("passport");

// Routes
// =============================================================
module.exports = function (app) {
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",

      failureRedirect: "/signup",
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/",

      failureRedirect: "/signin",
    })
  );

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
    console.log("logout success");
  });

  //
  app.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/signin", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/signin.html"));
  });

  // app.get("/dashboard", isLoggedIn, function (req, res) {
  //   res.sendFile(path.join(__dirname, "../public/dashboard.html"));
  // });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/signin");
  }

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads the homepage, customer-list.html
  app.get("/", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-list.html"));
  });

  // route to load add customer page
  app.get("/addCustomer", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-add.html"));
  });

  // route to load a customer's details page
  app.get("/customerDetails", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-details.html"));
  });

  // route to load page to update customer's data
  app.get("/customerUpdate", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-update.html"));
  });

  // route to load page to add a new sale
  app.get("/sale", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/sale-add.html"));
  });

  // route to load page to update a sale's data
  app.get("/saleUpdate", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/sale-update.html"));
  });

  // route to get e-mail list
  app.get("/emailList", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/email-list.html"));
  });
};
