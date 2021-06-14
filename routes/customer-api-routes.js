// require in our models
const db = require("../models");

module.exports = function (app) {
  // route to get all customers
  app.get("/customers", function (req, res) {
    db.Customer.findAll({
      // include: [db.Sale]
    }).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });

  // route to get one customer
  app.get("/customers/:id", function (req, res) {
    // Find one Customer with the id in req.params.id and return them to the user with res.json
    db.Customer.findOne({
      where: {
        id: req.params.id,
      },
    }).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });

  // route to search customer database for matching phone number
  app.get("/search", function (req, res) {
    db.Customer.findOne({
      where: {
        phone: req.query.phone,
      },
    }).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });

  // route to create a new customer
  // If a user sends data to add a new customer..
  app.post("/customers", function (req, res) {
    // take the request..
    var customerData = req.body;
    // Then add the customer to the database using sequelize
    db.Customer.create({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      dob: customerData.dob,
      phone: customerData.phone,
      email: customerData.email,
      mileage: customerData.mileage,
    }).then(function (newCustomer) {
      res.json(newCustomer);
    });
  });

  // route to update a customer's information
  app.put("/customers", function (req, res) {
    // console.log("req body", req.body);
    // console.log("req query", req.params);
    db.Customer.update(req.body, {
      where: {
        id: req.body.id,
      },
    }).then(function (newCustomer) {
      res.json(newCustomer);
    });
  });

  // route to delete a customer
  app.delete("/customers/:id", function (req, res) {
    db.Customer.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });
};
