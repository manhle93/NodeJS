const e = require("express");
const {body, check} = require("express-validator");
const User = require("../models").User;

const userValidator = {
  signUp: () => {
    return [
      body("name", "Tên người dùng không tồn tại").not().isEmpty(),
      body("userName", "Tên đăng nhập không tồn tại")
        .exists()
        .custom(value => {
          return new Promise((resolve, reject) => {
            User.findOne({where: {userName: value}}).then(res => {
              if (Boolean(res)) {
                reject(new Error("Tên đăng nhập đã được sử dụng"));
              }
              resolve(true);
            });
          });
        }),
      body("email", "Email không tồn tại").exists().not().isEmpty(),
      check("email", "Email không hợp lệ")
        .isEmail()
        .custom(value => {
          return new Promise((resolve, reject) => {
            User.findOne({where: {email: value}}).then(res => {
              if (Boolean(res)) {
                reject(new Error("E-mail Đã được sử dụng"));
              }
              resolve(true);
            });
          });
        }),

      body("password", "Mật khẩu không tồn tại").exists(),
      check("passwordConfirmation", "Mật khẩu 2 lần không trùng khớp")
        .exists()
        .custom((value, {req}) => value === req.body.password),
    ];
  },
  updateUser: () => {
    return [
      body("name", "Tên người dùng không tồn tại").not().isEmpty(),
      body("userName", "Tên đăng nhập không tồn tại").not().isEmpty(),
      body("email", "Email không tồn tại").exists().not().isEmpty(),
      body("roleId", "Quyền quản trị không tồn tại").exists().not().isEmpty(),
    ];
  },
  createUser: () => {
    return [
      body("name", "Tên người dùng không tồn tại").not().isEmpty(),
      body("userName", "Tên đăng nhập không tồn tại").not().isEmpty(),
      body("email", "Email không tồn tại").exists().not().isEmpty(),
      body("roleId", "Quyền quản trị không tồn tại").exists().not().isEmpty(),
      body("password", "Mật khẩu không tồn tại").exists().not().isEmpty(),
    ];
  },

  login: () => {
    return [
      body("password", "Vui lòng nhập mật khẩu đăng nhập").exists(),
      body("email_username", "Vui lòng nhập địa chỉ Email hoặc tên đăng nhập").exists(),
    ];
  },
  changePassword: () => {
    return [
      body("currentPass", "Mật khẩu hiện tại không thể bỏ trống").not().isEmpty(),
      body("newPassWord", "Hãy nhập mật khẩu mới").not().isEmpty(),
      body("reNewPassWord", "Chưa nhập lại mật khẩu mới").not().isEmpty(),
    ];
  },
};

module.exports = userValidator;
