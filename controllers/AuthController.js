var bcrypt = require('bcryptjs');
const User = require('../models').User
const { validationResult } = require('express-validator/check');
const JWT_SECRET = require('../env')
const Op = require('sequelize').Op;
const jwt = require('jsonwebtoken');

class AuthController {
  login = async (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      res.status(422).json({ message: 'Vui lòng nhập email, hoặc tên đăng nhập và mật khẩu', errors: errors.array() });
      return;
    }
    const data = req.body
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: data.email_username }, { userName: data.email_username }]
      }
    })
    let checkPass = bcrypt.compareSync(data.password, user.password)
    if (checkPass) {
      const token = await this.makeToken(user)
      if (token) {
        return res.status(200).json(token);
      } else {
        return res.status(500).json({ message: 'Đăng nhập thất bại' });
      }
    } else {
      return res.status(422).json({ message: 'Email, tên đăng nhập hoặc mật khẩu không chính xác' });

    }

  }
  makeToken = async (user) => {
    try {
      const timeLifeAccessToken = 3600  //Thời gian sống của access_token tính bằng phút
      const timeLifeRefreshToken = 3600 * 72 // refresh_token = 72 giờ 
      const access_token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: timeLifeAccessToken });
      const refresh_token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: timeLifeRefreshToken });
      let oldToken = JSON.parse(user.tokens)
      if (oldToken === null) {
        oldToken = []
      }
      oldToken.push({ access_token: access_token, refresh_token: refresh_token })
      await user.update({
        tokens: JSON.stringify(oldToken)
      })
      return { message: 'Đăng nhập thành công', access_token: { token: access_token, expiresIn: timeLifeAccessToken + ' min' }, refresh_token: { token: refresh_token, expiresIn: timeLifeRefreshToken + ' min' } }
    } catch (error) {
      console.log(error)
      return false
    }

  }
  getToken = async (req, res)=> {
    const token = req.header('Authorization').replace('Bearer', '').trim();
    const user_id = jwt.verify(token, JWT_SECRET)
    let user = await User.findOne({where: {id: user_id.user_id}});
    return res.json(user)
  }
  signUp = async (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      res.status(422).json({ message: 'Dữ liệu không hợp lệ! Không thể đăng ký', errors: errors.array() });
      return;
    }
    const data = req.body
    let passHashed = bcrypt.hashSync(data.password, 10)
    try {
      const user = await User.create({ name: data.name, userName: data.userName, email: data.email, password: passHashed, roleId: 1 });
      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }

  }
}

module.exports = new AuthController;