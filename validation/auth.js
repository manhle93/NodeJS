const User = require('../models').User
const jwt = require('jsonwebtoken');
const JWT_CONFiG = require('../config/jwt')

const Auth = {
    auth: async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer', '').trim();
            const decodeJwt = jwt.verify(token, JWT_CONFiG.SECRET_KEY)
            const user = await User.findOne({where: {id: decodeJwt.user_id}})
            let checkUseToken = JSON.parse(user.tokens).find(el => el == token)
            if(!checkUseToken){
                throw new Error()
            }else{
                req.user = user
                next()
            }
        } catch (error) {
            return res.status(422).json({ message: 'Vui lòng đăng nhập lại để sử dụng phần mềm'});
        }
    }
}
module.exports = Auth