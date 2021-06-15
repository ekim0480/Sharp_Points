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
        isEmail: true,
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

  return Customer;
};
