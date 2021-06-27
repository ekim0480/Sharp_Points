'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('User', {
      firstname: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
  
      lastname: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
  
      username: {
        type: Sequelize.TEXT,
      },
  
      about: {
        type: Sequelize.TEXT,
      },
  
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
  
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  
      last_login: {
        type: Sequelize.DATE,
      },
  
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('User')
  }
};
