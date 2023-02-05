const Yup = require("yup");

const schema = Yup.object().shape({
        
        title: Yup.string().required("عنوان پست الزامی می باشد").min("5","عنوان پست نباید کمتر از 5 کاراکتر باشد").max("100","عنوان پست نباید بیشتر از 100 کاراکتر باشد"),
        
        body: Yup.string().required("پست شما باید دارای محتوا باشد"),
        
        status: Yup.mixed().oneOf(["عمومی","خصوصی"],"یکی از دو وضعیت خصوصی یا عمومی را انتخاب کنید"),
});
module.exports = {
    schema,
}