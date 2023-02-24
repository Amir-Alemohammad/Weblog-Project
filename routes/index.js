const {Router} = require('express');
const blogController = require("../controllers/blogController.js");
const router = new Router();

// @desc Index route
router.get("/",blogController.getIndex);

// @desc single post route
router.get("/post/:id",blogController.getSinglePost);

// @desc get contact route 
router.get("/contact",blogController.getContact);

// @desc Post Contact Route
router.post("/contact",blogController.handleContact);

// @desc Weblog Numric Captcha
router.get("/captcha.png",blogController.getCaptcha);

// @desc Search Handler 
router.post("/search",blogController.handleSearch);

module.exports = router;