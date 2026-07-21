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
    // followers: {
    //     type: Number,
    //     minlength: 0
    // },
    // following: {
    //     type: Number,
    //     minlength: 0,
    // },
  
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;