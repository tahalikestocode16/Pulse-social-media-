const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");
const Post = require("./post.js");
const commentSchema = new Schema({
    author: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true
        //  i dont think required would be needed since we will verify session later to comment
    },
    message: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
         ref: "Post",
    },
    createdAt: {
         type: Date
    }
})

module.exports = mongoose.model("Comment", commentSchema);
