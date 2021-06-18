module.exports = (sequelize, DataTypes) => {
    const Mileage = sequelize.define("Mileage", {
      // Giving the Mileage model structure
      number: {
          type: DataTypes.STRING(15)
      }
    });
  
    // Telling our model that each can belong to many Customers
    Mileage.associate = function (models) {
      Mileage.belongsToMany(models.Customer, {through: "CustomerMileage"});
    };
  
    return Mileage;
  };
  