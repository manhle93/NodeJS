'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Menu.init({
    parentId: DataTypes.STRING,
    name: DataTypes.STRING,
    routerLink: DataTypes.STRING,
    icon: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};