// require in our models
const db = require("../models");

module.exports = function (app) {
  // route to get all customers
  app.get("/customers", function (req, res) {
    db.Customer.findAll({
      // include: [db.Sale]
      // include: [db.Mileage],
      order: [["lastName", "ASC"]],
    }).then(function (dbCustomer) {
      res.json(dbCustomer), { user: req.user };
    });
  });

  // route to get one customer
  app.get("/customers/:id", function (req, res) {
    // Find one Customer with the id in req.params.id and return them to the user with res.json
    db.Customer.findOne({
      include: [db.Mileage],
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

  app.get("/email", function (req, res) {
    db.Customer.findAll({
      attributes: ["email"],
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
      gender: customerData.gender,
      dob: customerData.dob,
      phone: customerData.phone,
      email: customerData.email,
    }).then(function (newCustomer) {
      res.json(newCustomer);
    });
  });

  app.post("/mileages", function (req, res) {
    var mileageData = req.body;

    db.Mileage.create({
      mileage: mileageData.mileage,
      CustomerId: mileageData.customerId,
    }).then(function (newMileage) {
      res.json(newMileage);
    });
  });

  // route to update a customer's point total
  app.put("/addPoints", function (req, res) {
    // console.log("REQ BODY", req.body);
    // console.log("this is what i want", req.body.finalPoints);
    db.Customer.update(
      // tell Customer table to update the column totalPoints:...
      { totalPoints: req.body.finalPoints },
      // only where the customer's id matches
      { where: { id: req.body.customerId } }
    ).then(function (updatedPoints) {
      res.json(updatedPoints);
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

  app.delete("/mileages/:id", function (req, res) {
    db.Mileage.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (dbMileage) {
      res.json(dbMileage);
    });
  });
};
