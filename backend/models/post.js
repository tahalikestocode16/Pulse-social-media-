const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");

// one to sequilion method used here
const postSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
     type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
     ref: "User",
  }]
},  {
    timestamps: true
}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;