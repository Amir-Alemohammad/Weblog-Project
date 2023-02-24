const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"./public/uploads/");
    },
    filename: (req,file,cb) => {
        // console.log(file);
        cb(null,`${uuid()}_${file.originalname}`);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype == "image/jpeg"){
        cb(null,true);
    }else{
        cb("تنها پسوند JPEG پشتیبانی می شود",false);
    }
}
module.exports = {
    storage,
    fileFilter,
}