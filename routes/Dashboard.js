const {Router} = require("express");
const {authenticated} = require('../middlewares/auth.js');
const router = new Router();
const dashController = require("../controllers/dashController.js");


// @desc Dashboard Route
router.get("/",authenticated,dashController.getDashboard);

// @desc Add Post Route 
router.get("/add-post",authenticated,dashController.getAddPost);

// @desc Add post to DataBase
router.post("/add-post",authenticated,dashController.creatPost);

// @desc Upload image 
router.post("/image-upload",authenticated,dashController.uploadImage);


module.exports = router;