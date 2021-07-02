module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    // Giving the Sale model structure
    type: {
      type: DataTypes.STRING(10),
      defaultValue: "",
      allowNull: true,
    },
    origin: {
      type: DataTypes.STRING(20),
      defaultValue: "",
      allowNull: true,
    },
    depDetails: {
      type: DataTypes.STRING(20),
      defaultValue: "",
      allowNull: true,
    },
    depDate: {
      type: DataTypes.STRING(15),
      defaultValue: "",
    },
    destination: {
      type: DataTypes.STRING(20),
      defaultValue: "",
      allowNull: true,
    },
    arrivalDetails: {
      type: DataTypes.STRING(20),
      defaultValue: "",
      allowNull: true,
    },
    arrivalDate: {
      type: DataTypes.STRING(15),
      defaultValue: "",
    },
    saleAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: "0.00",
      allowNull: true,
    },
    profit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: "0.00",
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: "0",
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: true,
    },
    // usedPoints: {
    //   type: DataTypes.STRING,
    //   defaultValue: ""
    // }
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
