const express = require("express");
const router = express.Router();
const Post = require("../models/post.js");
const isLogged = require("../middleware/authenticate.js");
const isPostOwner = require("../middleware/postowner.js");

// Index route
router.get("/posts", async (req, res)=> {
    const posts = await Post.find();
    res.json(posts);
});

// Read route 
router.get(":id/view", async (req, res)=> {
    let post = await Post.findById(req.params.id);
    res.json(post);
})

// Create route
router.post("/create", isLogged, async (req, res)=> {
    let { content, author, createdAt, title } = req.body;
    await Post.create({
        title: title,
        content: content,
        author: author,
        createdAt: Date.now()
    });
    res.json({message: "Post created"});
});

// Edit route 
router.patch("/edit", isPostOwner, async (req, res)=> {
    let { id, content, title } = req.body; 
    await Post.findByIdAndUpdate(id, {
        content: content,
        title: title,
    });
    res.json({message: "post succesfully updated"});
})

// Delete route
router.delete("/delete", isPostOwner, async (req, res)=> {
    let { id } = req.body;
    await Post.findByIdAndDelete(id);
    res.json({message: "Post deleted"});
});
// will add deleting from admin panel or as admin later
module.exports = router;