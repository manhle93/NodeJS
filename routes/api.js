var express = require("express");
var router = express.Router();

const UserController = require("../controllers").UserController;
const RoleController = require("../controllers").RoleController;
const AuthController = require("../controllers").AuthController;
const UserValidator = require("../validation/userValidator");
const Auth = require("../validation/auth");
/* Auth Router. */
router.post("/login", UserValidator.login(), AuthController.login);
router.post("/signup", UserValidator.create(), AuthController.signUp);
router.post("/refresh", AuthController.refreshToken);
router.get("/logout", Auth.auth, AuthController.logout);
router.get("/logoutall", Auth.auth, AuthController.logoutAllDevice);
router.get("/me", AuthController.me);

router.get("/menus", Auth.auth, RoleController.getMenu);

module.exports = router;
