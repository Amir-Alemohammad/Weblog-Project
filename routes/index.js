const {Router} = require('express');

const router = new Router();

// @desc Index route

router.get("/",(req,res)=>{
    res.render("index.ejs",{
        pageTitle: "وبلاگ",
        path: "/",
    });
})

module.exports = router;