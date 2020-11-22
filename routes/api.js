var express = require('express');
var router = express.Router();

const UserController = require('../controllers').UserController
const AuthController = require('../controllers').AuthController
const UserValidator = require('../validation/userValidator')
const Auth = require('../validation/auth')
/* Auth Router. */
router.post('/login', UserValidator.login(), AuthController.login);
router.post('/signup', UserValidator.create(), AuthController.signUp)

router.post('/check',Auth.auth, AuthController.getToken)

module.exports = router;
