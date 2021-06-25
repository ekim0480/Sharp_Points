// require in our models
const { where } = require("sequelize/types");
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

  // app.put("/mileages", function (req, res) {
  //   db.Mileage.update(
  //     { mileage: req.body.mileage },
  //     { where: }
  //     )
  // })

  // app.delete
};
