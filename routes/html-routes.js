// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads the homepage, customer-list.html
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-list.html"));
  });

  // route to load add customer page
  app.get("/addCustomer", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-add.html"));
  });

  // route to load a customer's details page
  app.get("/customerDetails", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-details.html"));
  });

  // route to load page to update customer's data
  app.get("/customerUpdate", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/customer-update.html"));
  });

  // route to load page to add a new sale
  app.get("/sale", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/sale-add.html"));
  });

  // route to load page to update a sale's data
  app.get("/saleUpdate", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/sale-update.html"));
  });

  // route to get e-mail list
  app.get("/emailList", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/email-list.html"));
  });
};
