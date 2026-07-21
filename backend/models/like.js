const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");
const Post = require("./post.js");

const likeSchema = new Schema({
    author: {
             type: Schema.Types.ObjectId,
             ref: "User"
    },
    post: {
           type: Schema.Types.ObjectId,
             ref: "Post"
    }
});


