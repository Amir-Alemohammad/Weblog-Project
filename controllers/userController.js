const User = require('../models/User.js');


const fetch = require("node-fetch");

const passport = require('passport');


const login = (req,res) => {
    res.render("Login.ejs", {
        pageTitle: "صفحه ورود",
        path: "/Login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        key: process.env.SITE_KEY
    });
}

const handleLogin = async (req, res, next) => {
    
    //Google reCaptcha
    if(!req.body["g-recaptcha-response"]){
        req.flash("error","گزینه من رباط نیستم الزامی می باشد!");
        return res.redirect("/users/login");
    }
    const secretKey = process.env.CAPTCHA_KEY;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`

    const response = await fetch(verifyUrl,{
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-Type" : "application/x-www-form-urlencoded; charest= utf-8",
        },
    });
    
    const json = await response.json();

    
    if(json.success){

        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);

    }
    else{
        req.flash("error","مشکلی در اعتبار سنجی captcha به وجود آمده!");
        res.redirect("/users/login");
    }

    
};
const rememberMe = (req,res) => {
    if(req.body.remember){
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
    }else{
        req.session.cookie.expire = null;
    }
    res.redirect("/dashboard");
}

const logout = (req,res,next) => {
    
    req.session = null;
    
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    });
    res.redirect("/users/login");
};


const register = (req,res) => {
    res.render("Register.ejs", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/Register",
    });
}
const addUser = async (req,res) => {
    const errors = [];
    try {
        
        await User.userValidation(req.body);
        const {fullname,email,password} = req.body;
        const userEmailAvailable = await User.findOne({email});
        const userAvailable = await User.findOne({fullname,email});
        if(userAvailable){
            errors.push({message: "شما قبلا با این اسم و ایمیل ثبت نام کرده اید"});
               return res.render("Register.ejs",{
                pageTitle: "ثبت نام کاربر جدید",
                path: "/Register",
                errors : errors,
            });
        }
        if(userEmailAvailable){
            errors.push({message:"کاربری با این ایمیل قبلا ثبت نام کرده است"});
            return res.render("Register.ejs",{
                pageTitle: "ثبت نام کاربر جدید",
                path: "/Register",
                errors:errors,
            });
        }
        await User.create({
            fullname,
            email,
            password,
        });
        req.flash("success_msg" ,"ثبت نام موفقیت آمیز بود.");
        res.redirect("/users/login");
    } catch (err) {
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });
        return res.render("Register.ejs",{
            pageTitle: "ثبت نام کاربر جدید",
            path: "/Register",
            errors: errors,
        });
    }
}
module.exports = {
    handleLogin,
    logout,
    login,
    register,
    addUser,
    rememberMe,
}