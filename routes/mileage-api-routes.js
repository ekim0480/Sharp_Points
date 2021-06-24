// require in our models
const db = require("../models");

module.exports = function (app) {
  // GET route to get all mileage numbers
  app.get("/mileages", function (req, res) {
    db.Mileage.findAll({}).then(function (dbMileage) {
      res.json(dbMileage);
    });
  });

  app.post("/mileages", function (req, res) {
    db.Mileage.create({
      mileage: req.body.mileage,
      CustomerId: req.body.customerId,
    });
  });

  // app.put

  // app.delete
};
