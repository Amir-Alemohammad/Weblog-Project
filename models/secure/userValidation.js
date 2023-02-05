const Yup = require('yup');

const Schema = Yup.object().shape({
    fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد").min(3,"نام و نام خانوادگی نمی تواند کمتر از 3 کاراکتر باشد"),
    email: Yup.string().email(),
    password: Yup.string().min(6,"کلمه عبور نمی تواند کمتر از 6 کاراکتر باشد").required("کلمه عبور الزامی می باشد"),
    ConfirmPassword: Yup.string().required().oneOf([Yup.ref("password"),null],"تکرار کلمه عبور با کلمه عبور یکسان نیست").min(6,"تکرار کلمه عبور نمی تواند کمتر از 6 کاراکتر باشد"),
});
module.exports = Schema;
