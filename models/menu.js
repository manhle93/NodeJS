'use strict';
const {
  Model
} = require('sequelize');
const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt', 'active']

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toJSON () {
      // hide protected fields
      let attributes = Object.assign({}, this.get())
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a]
      }
      return attributes
    }
    static associate(models) {
      // Menu.hasMany(models.MenuRole, {
      //   foreignKey: 'menuId',
      //   as: 'MenuRoles',
      // });
      Menu.hasMany(models.Menu, {
        foreignKey: 'parentId',
        as: 'children',
      });
    }
  };
  Menu.init({
    parentId: DataTypes.INTEGER,
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