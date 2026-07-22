const express = require("express");
const router = express.Router();
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");
const isLogged = require("../middleware/authenticate.js");
const isCommentOwner = require("../middleware/cmtowner.js");

// Index route
router.get("/comments", async (req, res)=> {
    const comment = await Comment.find();
    res.json(posts);
});

// // Read route 
// router.get("/comment/view", async (req, res)=> {
//     let post = await Comment.findById(req.params.id);
// })

// Create route
router.post("/create", isLogged, async (req, res)=> {
    let { author, message, createdAt } = req.body;
    await Comment.create({
        author: author,
        message: message,
        createdAt: Date.now()
    });
    res.json({message: "comment added"});
});

// Edit route 
router.patch("/:id/edit", isLogged, isCommentOwner, async (req, res)=> {
    let { id, author, message } = req.body; 
    await Comment.findByIdAndUpdate(id, {
        message: message,
        author: author,
    });
    res.json({message: "comment updated"});
})

// Delete route
router.delete("/:id/delete", isLogged, isCommentOwner, async (req, res)=> {
    let { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({message: "Comment deleted"});

});
module.exports = router;