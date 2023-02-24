const {Router} = require('express');

const userController = require('../controllers/userController.js'); 
const { authenticated } = require('../middlewares/auth.js');

const router = new Router();
// @desc Yup validating


// @desc Login Route
router.get("/Login", userController.login);


// @desc Login Handle
router.post("/Login", userController.handleLogin, userController.rememberMe);


// @desc Logout Handle
router.get("/logout", authenticated, userController.logout);


// @desc Register Route
router.get("/Register", userController.register);


// @desc get input values on post method 
router.post("/Register", userController.addUser);

module.exports = router;