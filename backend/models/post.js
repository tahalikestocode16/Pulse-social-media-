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
  }],
  mediaUrl: {
    type: String,
  },
  mediaType: {
    enum: ["image", "video"]
    // enum means its allowed to have either of these two values type can either be image or video

  }
},  {
    timestamps: true
}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;