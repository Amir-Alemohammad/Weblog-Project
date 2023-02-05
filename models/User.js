const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const SchemaValidation = require('./secure/userValidation.js');


const UserSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        trim: true,
        minlength: 6,
        maxlength: 255,
    },
    Date:{
        type: Date,
        default: Date.now,
    },
});
UserSchema.statics.userValidation = function(body){
    return SchemaValidation.validate(body,{abortEarly: false});
}
UserSchema.pre("save", function(next){
    let user = this;
    if(!user.isModified("password")) return next();
    
    bcrypt.hash(user.password , 10 , (err,hash) => {
        if(err) return next(err);

        user.password = hash;
        next();
    });

});
const User = mongoose.model("User",UserSchema);

module.exports = User;