const User = require('../models').User
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../env')

const Auth = {
    auth: (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer', '').trim();
            const user_id = jwt.verify(token, JWT_SECRET)
            next()
        } catch (error) {
            return res.status(422).json({ message: 'Vui lòng đăng nhập lại để sử dụng phần mềm'});
        }
    }
}
module.exports = Auth