const Yup = require("yup");
const captchapng = require("captchapng");

const Post = require("../models/Posts.js");
const {formatDate} = require("../utils/jalali-moment.js");
const {trunCate} = require("../utils/helpers.js");
const { get500 } = require("./errorController.js");

let CAPTCHA_NUM;

const getIndex = async (req,res) => {
    const page = +req.query.page || 1;
    const postPerPage = 2;
    try {
        const numberOfPosts = await Post.find({
            status: "public",
        }).countDocuments();

        const posts = await Post.find({
            status : "public",
        }).sort({
            Date: "desc",
        }).skip((page - 1) * postPerPage).limit(postPerPage);

        res.render("index.ejs",{
            pageTitle: "وبلاگ",
            path : "/",
            posts,
            formatDate,
            trunCate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            oneToLast: Math.ceil(numberOfPosts / postPerPage - 1),
        })
    } catch (err) {
        console.log(err);
        get500(req,res)
    }
}
const getSinglePost = async (req,res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
        }).populate("user");
        if(!post){
            return res.render("/404");
        }
        res.render("post.ejs",{
            pageTitle: post.title,
            path: "/post",
            post,
            formatDate,
        })
    } catch (err) {
        console.log(err);
        get500(req,res)
    }
}
const getContact = (req,res) => {
    res.render("contact.ejs",{
        pageTitle: "ارتباط با ما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: [],        
    });
}
const handleContact = async (req,res) => {

    const errorArr = [];
    const {captcha} = req.body;
    const schema = Yup.object().shape({
        fullname: Yup.string().required("نام و نام خانوادگی الزامی میباشد"),
        email: Yup.string().email("ایمیل معتبر نیست").required("ایمیل الزامی میباشد"),
        message: Yup.string().required("پیام الزامی میباشد"),
    });
    try {
        await schema.validate(req.body,{abortEarly:false});
        
        if(parseInt(captcha) === CAPTCHA_NUM){
            
            req.flash("success_msg","پیام شما با موفیقت ارسال شد");
       
            return res.render("contact.ejs",{
                pageTitle: "ارتباط با ما",
                path: "/contact",
                message: req.flash("success_msg"),
                error: req.flash("error"),
                errors: errorArr,        
            });
        }
       
        req.flash("error","کد امنیتی صحیح نیست");

        res.render("contact.ejs",{
        pageTitle: "ارتباط با ما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: errorArr,        
    });

    } catch (err) {
        
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("contact.ejs", {
            pageTitle: "تماس با ما",
            path: "/contact",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            errors: errorArr,
        });
    }
}
const getCaptcha = (req,res) => {
    CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
    const cp = new captchapng(80,30,CAPTCHA_NUM);
    cp.color(0,0,0,0);
    cp.color(80,80,80,255);
    const img = cp.getBase64();
    const imageBase64 = Buffer.from(img, "base64");
    res.send(imageBase64);
}
const handleSearch = async (req,res) =>{
    const page = +req.query.page || 1;
    const postPerPage = 2;
    try {
        const numberOfPosts = await Post.find({
            status: "public",
            $text: {$search: req.body.search},
        }).countDocuments();

        const posts = await Post.find({
            status : "public",
            $text: {$search: req.body.search},
        }).sort({
            Date: "desc",
        }).skip((page - 1) * postPerPage).limit(postPerPage);

        res.render("index.ejs",{
            pageTitle: "نتایج جست و جو",
            path : "/",
            posts,
            formatDate,
            trunCate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            oneToLast: Math.ceil(numberOfPosts / postPerPage - 1),
        })
    } catch (err) {
        console.log(err);
        res.render("errors/500.ejs",{
            pageTitle: "500 || خطای سرور",
            path: "/404",
        });
    }        
}
module.exports = {
    getIndex,
    getSinglePost,
    getContact,
    handleContact,
    getCaptcha,
    handleSearch,
}




