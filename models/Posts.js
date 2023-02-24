const mongoose = require("mongoose");

const {schema} = require("./secure/postValidation.js");

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    body:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "public",
        enum: ["public","private"],
    },
    thumbnail:{
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Date:{
        type : Date,
        default: Date.now,
    },
});

postSchema.index({title : "text"});

postSchema.statics.postValidation = function (body) {
    
    return schema.validate(body,{abortEarly: false});
    
}

const Post = mongoose.model("Post",postSchema);

module.exports = Post;