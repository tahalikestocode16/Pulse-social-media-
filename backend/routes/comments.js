const express = require("express");
const router = express.Router();
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");
const isLogged = require("../models/middleware/authenticate.js");
const isCommentOwner = require("../models/middleware/cmtowner.js");
const User = require("../models/user.js");

// Index route
router.get("/:postId", async (req, res, next) => {
   try {
     const comments = await Comment.find({
        post: req.params.postId,
    }).populate("author");
    
  return  res.status(200).json(comments);
   }
   catch(err) {
    return next(err);
   }
});

// // Read route 
// router.get("/comment/view", async (req, res)=> {
//     let post = await Comment.findById(req.params.id);
// })

// Create route
router.post("/posts/:postId/comment", isLogged, async (req, res, next) => {
    try {

        
        let message = req.body.message;
        let author = req.user._id;
        let id = req.params.postId
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        
        let currentUser = await User.findById(req.user._id);
        let postAuthor = await User.findById(post.author);

        let blocked =
            currentUser.blockedUsers.some(
                blockedId => blockedId.toString() === post.author.toString()
            ) || (postAuthor && postAuthor.blockedUsers.some(
                blockedId => blockedId.toString() === currentUser._id.toString()
            ));

        if (blocked) {
            return res.status(403).json({ message: "unable to comment" });
        }
        await Comment.create({
            author: author,
            message: message,
            post: post,
        });
        res.json({ message: "comment added" });
    }
    catch (err) {
        return next(err);
    }
});

// Edit route 
router.patch("/:id", isLogged, isCommentOwner, async (req, res, next) => {
    try {
        let { id } = req.params;
        let message = req.body.message
        if (!message) {
            return res.status(404).json({ message: "invalid request" });
        }
        let comment = await Comment.findByIdAndUpdate(id,
            { message },
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ message: "comment does not exist" });
        }
        return res.status(200).json({ message: "comment updated" });
    }
    catch (err) {
        return next(err);
    }
})

// Delete route
router.delete("/:id", isLogged, isCommentOwner, async (req, res) => {
    let { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted" });

});
module.exports = router;