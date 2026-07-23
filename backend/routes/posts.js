const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Post = require("../models/post.js");
const isLogged = require("../middleware/authenticate.js");
const isPostOwner = require("../middleware/postowner.js");

// POST  / general feed
router.get("/fyp", async (req, res) => {
    try {
        if (req.user) {
        let currentUser = await User.findById(req.user._id);
        let feed = currentUser.following.push(req.user._id)
        let post = await Post.find({
                author: { $nin: feed }
            });
        return res.status(200).json(post);
        }
        // this person is not logged in means no curated feed show him generic top content
        else {
            // aggregate method se schema mai likecount add krwa rahe uski value jo hai jo likes ka size
            // hai wo hogi, its temporary nothing is saved to mongodb

            // basically original value mai ye lagake dedo and so and so cindition lelo
            let posts = await Post.aggregate([
                {
                    $addfields: {
                        likeCount: { $size: "likes "}
                    }
                },
                {
                    sort: {
                        likeCount: -1, 
                        // highest likes first -1 means descending 100> 50> 10 1 would be opposite 10> 50> 100
                        createdAt: -1
                        // if same likes newest first 
                    }
                },
                {
                    $limit: 20,
                    // only send the top 20 posts
                }
            ]);
            return res.status(200).json(posts);
        }
      
    }
    catch (err) {
        return res.status(400).json("feed not available try refreshing");
    }
});



// Post route / FYP 
router.get("/following", isLogged, async (req, res) => {
    try {
        let currentUser = await User.findById(req.user._id);
        let following = currentUser.following;

        let post = await Post.find({
            author: { $in: following }
        });
        return res.status(200).json(post);

    }
    catch (err) {
        return res.status(400).json("feed not available try refreshing");
    }

});

// Create route
router.post("/create", isLogged, async (req, res) => {
    let { content, author, title } = req.body;
    await Post.create({
        title: title,
        content: content,
        author: author,
        createdAt: Date.now()
    });
    res.json({ message: "Post created" });
});

// Edit route 
router.patch("/edit", isPostOwner, async (req, res) => {
    let { id, content, title } = req.body;
    await Post.findByIdAndUpdate(id, {
        content: content,
        title: title,
    });
    res.json({ message: "post succesfully updated" });
})

// Delete route
router.delete("/delete", isPostOwner, async (req, res) => {
    let { id } = req.body;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
});
// will add deleting from admin panel or as admin later
module.exports = router;


// ========================================= likes ===========================================

router.post("/:id/like", isLogged, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: " post does not exist " });
        }
        let message
        if (post.likes.some(id => id.equals(req.user._id))) {
            post.likes.pull(req.user._id);
            message = { message: " unliked post " };
        }
        else {
            post.likes.push(req.user._id);
            message = { message: " liked post " };
        }
        await post.save();
        return res.status(200).json(message);
    }
    catch (err) {
        return next(err);
    }
});