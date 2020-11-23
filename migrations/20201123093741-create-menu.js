'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
      },
      routerLink: {
        type: Sequelize.STRING,
        allowNull: true
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Menus');
  }
};