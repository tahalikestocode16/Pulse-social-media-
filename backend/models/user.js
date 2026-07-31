const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// This package uses ESM interop — require() returns { default: fn, errors: {...} }
// So we need .default to get the actual plugin function
const passportLocalMongoose = require("passport-local-mongoose").default;

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
        maxLength: 500,
    } ,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"

    },
    blockedUsers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;