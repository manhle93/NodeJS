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
  addMenu = async (req, res) => {
    const data = req.body;
    if (!data || !data.name) {
      return res.status(422).json({message: "Tên Menu không thể bỏ trống"});
    }
    let idMenu = await Menu.findAll({attributes: ["id"]});
    idMenu = idMenu.map(el => el.id);
    if (data.parentId && !idMenu.includes(Number(data.parentId))) {
      return res.status(422).json({message: "Menu cha không hợp lệ"});
    }
    try {
      const menu = await Menu.create({
        parentId: data.parentId ? data.parentId : null,
        name: data.name,
        icon: data.icon,
        iconColor: data.iconColor,
        textColor: data.textColor,
        order: data.order,
      });
      return res.status(200).json({message: "Thành công"});
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  editMenu = async (req, res) => {
    const data = req.body;
    if (!data || !data.name) {
      return res.status(422).json({message: "Tên Menu không thể bỏ trống"});
    }
    if (!data.id) {
      return res.status(422).json({message: "Không thể cập nhật Menu"});
    }
    let idMenu = await Menu.findAll({attributes: ["id"]});
    idMenu = idMenu.map(el => el.id);
    if (data.parentId && !idMenu.includes(Number(data.parentId))) {
      return res.status(422).json({message: "Menu cha không hợp lệ"});
    }
    try {
      const menu = await Menu.update(
        {
          parentId: data.parentId ? data.parentId : null,
          name: data.name,
          icon: data.icon,
          iconColor: data.iconColor,
          textColor: data.textColor,
          order: data.order,
        },
        {where: {id: data.id}}
      );
      return res.status(200).json({message: "Thành công"});
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  deleteMenu = async (req, res) => {
    const data = req.body;
    if (!data || !data.id) {
      return res.status(422).json({message: "Không thể xóa Menu"});
    }
    try {
      await Menu.destroy({where: {id: data.id}});
      return res.status(200).json({message: "Thành công"});
    } catch (error) {
      return res.status(500).json({message: "Không thể xóa menu"});
    }
  };
  getRouterName = async (req, res) => {
    let menu = await MenuRole.findAll({where: {roleId: user.roleId}, attributes: ["menuId"]});
    let menuID = menu.map(el => el.menuId);
    let data = await Menu.findAll({
      where: {id: menuID},
      raw: true, // Thuộc tính raw: true sẽ chuyển collect về Array thuần
      attributes: ["name"],
    });
    let routerNames = data.map(el => el.name)
    return res.status(200).json(routerNames)
  }
}

module.exports = new RoleController();
