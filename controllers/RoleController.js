const User = require("../models").User;
const Role = require("../models").Role;
const MenuRole = require("../models").MenuRole;
const Menu = require("../models").Menu;
const {Op} = require("sequelize");

class RoleController {
  getMenu = async (req, res) => {
    let user = req.user;
    let menu = await MenuRole.findAll({where: {roleId: user.roleId}, attributes: ["menuId"]});
    let menuID = menu.map(el => el.menuId);
    let childrenMenu = await Menu.findAll({
      where: {id: menuID, parentId: {[Op.not]: null}},
      raw: true, // Thuộc tính raw: true sẽ chuyển collect về Array thuần
      attributes: ["id", "parentId", "icon", "name"],
    });
    let parentMenu = await Menu.findAll({
      where: {id: menuID, parentId: null},
      raw: true,
      attributes: ["id", "parentId", "icon", "name"],
    });
    let menus = [];
    menus = parentMenu.map(el => {
      let children = childrenMenu.filter(it => it.parentId === el.id);
      return {
        ...el,
        children: children,
      };
    });
    return res.status(200).json(menus);
  };
}

module.exports = new RoleController();
