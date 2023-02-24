const Post = require("../models/Posts.js");
const {formatDate} = require("../utils/jalali-moment.js");
const {get500} = require("./errorController.js");
const {storage,fileFilter} = require("../utils/multer.js");
const fs = require("fs");

const multer = require("multer");
const sharp = require('sharp');
const shortId = require("shortid");
const appRoot = require("app-root-path");

const getDashboard = async (req,res) => {
    const page = +req.query.page || 1;
    const postPerPage = 2;

    try {
        
        const numberOfPosts = await Post.find({
            user: req.user.id,
        }).countDocuments();

        const posts = await Post.find({user: req.user.id}).skip((page - 1) * postPerPage).limit(postPerPage);


        res.render("private/blog.ejs",{
            pageTitle: "داشبورد | مدیریت",
            path: "/dashboard",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            posts,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            oneToLast: Math.ceil(numberOfPosts / postPerPage - 1),
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

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`; 


    try {
        req.body = {... req.body,thumbnail}; // validate thumbnail with Yup

        await Post.postValidation(req.body);
        
        await sharp(thumbnail.data)
              .jpeg({quality:60})
              .toFile(uploadPath)
              .catch((err) => console.log(err));

        await Post.create({
            ... req.body,
            user: req.user.id,
            thumbnail: fileName,
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
const editPost = async (req,res) => {

    const errorArr = [];
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`; 
    const post = await Post.findOne({
        _id : req.params.id,
    });
    try {
        if(thumbnail.name){
            await Post.postValidation({ ...req.body,thumbnail});
        }else{
            await Post.postValidation({
                ...req.body,
                thumbnail:{
                    name:"placeholder",
                    size:0,
                    mimetype:"image/jpeg",
                },
            });
        }
        
        if(!post){
            return res.redirect("/errors/404.ejs");
        }
        if(post.user.toString() != req.user._id){
            return res.redirect("/dashboard");
        }else{

            if(thumbnail.name){
                fs.unlink(`${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
                async(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        await sharp(thumbnail.data)
                              .jpeg({quality:60})
                              .toFile(uploadPath)
                              .catch((err) => console.log(err));
                    }
                });
            }

            const {title,status,body} = req.body;
            post.title = title;
            post.status = status;
            post.body = body;
            post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
            
            await post.save();
            return res.redirect("/dashboard");
        }
        
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message
            });
        });
        res.render("private/editPost.ejs",{
            pageTitle: "داشبورد | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            errors: errorArr,
            post,
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

                res.status(200).send(`http://ghorbany.dev/uploads/${filename}`);
            }else{
                res.send("برای آپلود عکسی انتخاب کنید")
            }
        }
        
    });
}
const getEditPost = async (req,res) =>{
    const post = await Post.findOne({
        _id: req.params.id,
    });
    if(!post){
        return res.redirect("/404");
    }
    if(post.user.toString() != req.user._id){
        return res.redirect("/dashboard");
    }
    else {

        res.render("private/editPost.ejs",{
            pageTitle: "داشبورد | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            post,
        });
    }
}
const deletePost = async (req,res) => {
    try {
        const post = await Post.findOne({
            _id : req.params.id,
        });
        if(!post){
            res.redirect("/404");
        }
        if(post.user.toString() != req.user._id){
            res.redirect("/dashboard");
        }else{
            await Post.findByIdAndRemove(req.params.id);
            res.redirect("/dashboard");
        }
    } catch (err) {
        get500(req,res)
    }
}
const handleSearchDash = async (req,res) => {
    const page = +req.query.page || 1;
    const postPerPage = 2;

    try {
        
        const numberOfPosts = await Post.find({
            user: req.user.id,
            $text: {$search: req.body.searchDash},
        }).countDocuments();

        const posts = await Post.find({
            user: req.user.id,
            $text: {$search: req.body.searchDash},
        }).skip((page - 1) * postPerPage).limit(postPerPage);


        res.render("private/blog.ejs",{
            pageTitle: "داشبورد | مدیریت",
            path: "/dashboard",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            posts,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            oneToLast: Math.ceil(numberOfPosts / postPerPage - 1),
        });
    } catch (err) {
        console.log(err);
        get500(req,res);
    }
}
module.exports = {
    getDashboard,
    getAddPost,
    creatPost,
    editPost,
    deletePost,
    uploadImage,
    getEditPost,
    handleSearchDash,
}