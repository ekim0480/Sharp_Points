validateEmail = (email) => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    // Giving the Customer model structure
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      notEmpty: true,
    },
    lastName: {
      type: DataTypes.STRING(20),
      // allowNull: false,
      notEmpty: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      // allowNull: false,
      validate: {
        isDate: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      // allowNull: false,
      validate: {
        isNumeric: true,
        isAlphanumeric: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        isEmailOrEmpty:(val, next) => {
          if (!val || val === "" || validateEmail(val)) {
            return next()
          }
          else {
            return next("Email is invalid!")
          }
        }
      },
    },
    mileage: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    totalPoints: {
      type: DataTypes.INTEGER(5).UNSIGNED.ZEROFILL,
      defaultValue: "0",
    },
  });

  // Telling our Customer model that each Customer can have many sales.
  Customer.associate = function (models) {
    Customer.hasMany(models.Sale, {
      // Delete all associated sales when deleting customer
      onDelete: "cascade",
    });
  };

  // Telling our model that each Customer can have many mileage numbers
  Customer.associate = function (models) {
    Customer.belongsToMany(models.Mileage, { through: "CustomerMileage" });
  };

  return Customer;
};
