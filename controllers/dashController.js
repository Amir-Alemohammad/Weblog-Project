const Post = require("../models/Posts.js");
const {formatDate} = require("../utils/jalali-moment.js");
const {get500} = require("./errorController.js");
const {storage,fileFilter} = require("../utils/multer.js");

const multer = require("multer");
const sharp = require('sharp');
const shortId = require("shortid");

const getDashboard = async (req,res) => {
    try {
        const posts = await Post.find({user: req.user.id});
        res.render("private/blog.ejs",{
            pageTitle: "داشبورد | مدیریت",
            path: "/dashboard",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            posts,
            formatDate,
        });    
    } catch (err) {
        console.log(err);
        get500(req,res);
    }
    
}
const getAddPost = (req,res) => {
    res.render("private/addPost.ejs",{
        pageTitle: "داشبورد | ساخت پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout.ejs",
        fullname: req.user.fullname,
    });
}
const creatPost = async (req,res) => {
    const errorArr = [];
    try {
        await Post.postValidation(req.body);
        await Post.create({
            ... req.body,
            user: req.user.id,
        });
        res.redirect("/dashboard");
        
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message
            });
        });
        res.render("private/addPost.ejs",{
            pageTitle: "داشبورد | ساخت پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            errors: errorArr,
        });
    }
}
const uploadImage = (req,res) => {

    const upload = multer({
        limits: {
            fileSize: 4000000,
        },
        // dest: "uploads/",
        // storage: storage,
        fileFilter: fileFilter,
    }).single("image"); 

    upload(req , res , async (err) => {

        if(err){
            if(err.code === "LIMIT_FILE_SIZE"){

                res.status(400).send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد");
            }
            res.status(400).send(err)
        }
        else
        {
            if(req.file){
                const filename = `${shortId.generate()}_${req.file.originalname}`
                await sharp(req.file.buffer).jpeg({
                    quality: 50,
                }).toFile(`./public/uploads/${filename}`)

                .catch(err => console.log(err));

                res.status(200).send(`http://localhost:3000/uploads/${filename}`);
            }else{
                res.send("برای آپلود عکسی انتخاب کنید")
            }
        }
        
    });
}

module.exports = {
    getDashboard,
    getAddPost,
    creatPost,
    uploadImage,
}