module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    // Giving the Sale model structure
    depCity: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    depFlight: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    depDate: {
      type: DataTypes.DATEONLY,
    },
    desCity: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    retFlight: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    retDate: {
      type: DataTypes.DATEONLY,
    },
    saleAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: "0",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  // Telling our model that each sale must and can only belong to one Customer
  Sale.associate = function (models) {
    Sale.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Sale;
};
