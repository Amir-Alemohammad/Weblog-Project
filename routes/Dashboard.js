const {Router} = require("express");
const {authenticated} = require('../middlewares/auth.js');
const router = new Router();
const dashController = require("../controllers/dashController.js");


// @desc Dashboard Route
router.get("/",authenticated,dashController.getDashboard);

// @desc Add Post Route 
router.get("/add-post",authenticated,dashController.getAddPost);

// @desc Edit Post Route
router.get("/edit-post/:id",authenticated,dashController.getEditPost);

// @desc Edit Post add to DataBase 
router.post("/edit-post/:id",authenticated,dashController.editPost);

// @desc Delete Post
router.get("/delete-post/:id",authenticated,dashController.deletePost);

// @desc Add post to DataBase
router.post("/add-post",authenticated,dashController.creatPost);

// @desc Upload image 
router.post("/image-upload",authenticated,dashController.uploadImage);

// @desc Search Handler Dashboard
router.post("/search-dash",dashController.handleSearchDash);


module.exports = router;