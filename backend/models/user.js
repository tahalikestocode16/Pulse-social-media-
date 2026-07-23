const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
// .default needs to be added since plm is an object and we need it as a function
// one to one method used here

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [{
         type: Schema.Types.ObjectId,
         ref: "User",
    }],
    following: [{
         type: Schema.Types.ObjectId,
         ref: "User",
    }],
    profilePic: {
       type: String,
       default: "https://res.cloudinary.com/xfub3wft/image/upload/f_auto,q_auto/default_dsy2xs"
    },
    bio: {
        type: String,
        maxLength: 64,
        minlength: 1
    } 
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;