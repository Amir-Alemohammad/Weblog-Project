const Yup = require("yup");

const schema = Yup.object().shape({
        
        title: Yup.string()
        .required("عنوان پست الزامی می باشد")
        .min("5","عنوان پست نباید کمتر از 5 کاراکتر باشد")
        .max("100","عنوان پست نباید بیشتر از 100 کاراکتر باشد"),
        
        body: Yup.string()
        .required("پست شما باید دارای محتوا باشد"),
        
        status: Yup.mixed()
        .oneOf(["public","private"],"یکی از دو وضعیت خصوصی یا عمومی را انتخاب کنید"),

        thumbnail: Yup.object().shape({
            name: Yup.string().required("عکس بندانگشتی الزامی می باشد"),
            size: Yup.number().max(3000000,"حجم عکس نباید بیشتر از 3 مگابایت باشد"),
            mimetype: Yup.mixed().oneOf(["image/jpeg","image/png"],"تنها پسوند های png و jpeg پشتیبانی می شود"),
        }),
});
module.exports = {
    schema,
}