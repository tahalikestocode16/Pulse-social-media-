const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
         required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Comment", commentSchema);
