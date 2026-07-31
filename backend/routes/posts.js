const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Post = require("../models/post.js");
const isLogged = require("../models/middleware/authenticate.js");
const isPostOwner = require("../models/middleware/postowner.js");
const postUpload = require("../models/middleware/postupload.js");
const SavedPost = require("../models/savedpost.js");

// POST  / general feed
// router.get("/fyp", async (req, res) => {
//     const posts = await Post.find({}).populate("author");
//     res.json(posts);
// });

router.get("/fyp", async (req, res, next) => {
    try {
        let posts = await Post.find({}).populate("author").sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (err) {
        return next(err);
    }
});



// Post route / FYP 
router.get("/following", isLogged, async (req, res) => {
    try {
        let currentUser = await User.findById(req.user._id);
        let following = currentUser.following;

        let post = await Post.find({
            author: { $in: following, $nin: currentUser.blockedUsers }
        }).populate("author");
        return res.status(200).json(post);

    }
    catch (err) {
        return res.status(400).json("feed not available try refreshing");
    }

});

// Create route
router.post("/create", isLogged, postUpload.single("media"), async (req, res, next) => {
    try {
        let { title } = req.body;
        let author = req.user._id;
        
        let mediaUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
        let mediaType = "image";
        let publicId = undefined;

        if (req.file) {
            const isVideo = req.file.mimetype?.includes("video");
            mediaType = isVideo ? "video" : "image";

            // Try Cloudinary upload stream safely
            try {
                const { cloudinary } = require("../config/cloudinary");
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "pulse/posts", resource_type: isVideo ? "video" : "image" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
                if (uploadResult && uploadResult.secure_url) {
                    mediaUrl = uploadResult.secure_url;
                    publicId = uploadResult.public_id;
                }
            } catch (cloudErr) {
                console.log("Cloudinary upload fallback to base64 data URI:", cloudErr.message || cloudErr);
                // Fallback to base64 Data URI so creation NEVER fails
                mediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            }
        }

        const newPost = await Post.create({
            title: title || "New Pulse Post",
            author,
            mediaUrl,
            mediaType,
            publicId
        });

        const populatedPost = await Post.findById(newPost._id).populate("author");

        return res.status(201).json({ message: "Post created", post: populatedPost });
    }
    catch (err) {
        console.error("Post creation error:", err);
        return res.status(500).json({ message: err.message || "Failed to create post" });
    }
});

// GET single post by ID
router.get("/:id", async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "username profilePic");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (err) {
        return next(err);
    }
});

// GET comments for a post
router.get("/:id/comments", async (req, res, next) => {
    try {
        const Comment = require("../models/comment.js");
        const comments = await Comment.find({ post: req.params.id }).populate("author", "username profilePic");
        return res.status(200).json(comments);
    } catch (err) {
        return next(err);
    }
});

// Create comment on post route
router.post("/:id/comment", isLogged, async (req, res, next) => {
    try {
        const Comment = require("../models/comment.js");
        let message = req.body.message;
        let author = req.user._id;
        let id = req.params.id;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        let newComment = await Comment.create({
            author: author,
            message: message,
            post: id,
        });

        let populatedComment = await Comment.findById(newComment._id).populate("author", "username profilePic");

        // Send notification to post author if not self-commenting
        if (post.author.toString() !== req.user._id.toString()) {
            try {
                const Notification = require("../models/notification.js");
                await Notification.create({
                    sender: req.user._id,
                    receiver: post.author,
                    notifType: "comment",
                    type: "comment",
                    post: post._id,
                    comment: newComment._id
                });
            } catch(nErr) {
                console.log("Comment notification error:", nErr);
            }
        }

        return res.status(201).json({ message: "comment added", comment: populatedComment });
    }
    catch (err) {
        return next(err);
    }
});

// Edit route 
router.patch("/:id", isLogged, isPostOwner, async (req, res, next) => {
    try {
        let { content, title } = req.body;
        let id = req.params.id;
        let updateTitle = title || content || "Pulse Post";
        let post = await Post.findByIdAndUpdate(id, {
            title: updateTitle,
        }, { new: true }).populate("author", "username profilePic");
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        return res.json({ message: "post succesfully updated", post });
    }
    catch (err) {
        return next(err);
    }
});

// Delete route
router.delete("/:id", isLogged, isPostOwner, async (req, res, next) => {
    try {
        let id = req.params.id;
        let post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        const { cloudinary } = require("../cloudConfig");

        if (post.mediaUrl) {

           await cloudinary.uploader.destroy(post.publicId, {
    resource_type: post.mediaType
});
        }
        return res.json({ message: "Post deleted" });

    }
    catch (err) {
        return next(err);
    }
});
// will add deleting from admin panel or as admin later


// ========================================= likes ===========================================

router.post("/:id/like", isLogged, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        const postAuthor = await User.findById(post.author);
        if (!post) {
            return res.status(404).json({ message: " post does not exist " });
        }
        let currentUser = await User.findById(req.user._id);
        if (currentUser.blockedUsers.includes(post.author.toString())
            ||
            postAuthor.blockedUsers.includes(req.user._id)) {
            return res.status(403).json({ message: "cannot like posts from blocked users" });
        }
        let message
        if (post.likes.some(id => id.equals(req.user._id))) {
            post.likes.pull(req.user._id);
            message = { message: " unliked post " };
        }
        else {
            post.likes.push(req.user._id);
            message = { message: " liked post " };

            // Send notification to post author if not self-liking
            if (post.author.toString() !== req.user._id.toString()) {
                try {
                    const Notification = require("../models/notification.js");
                    await Notification.create({
                        sender: req.user._id,
                        receiver: post.author,
                        notifType: "like",
                        type: "like",
                        post: post._id
                    });
                } catch(nErr) {
                    console.log("Like notification error:", nErr);
                }
            }
        }
        await post.save();
        return res.status(200).json({
            message: message.message,
            likes: post.likes
        });
    }
    catch (err) {
        return next(err);
    }
});


// ===================================== SAVING POSTS ==========================================
// saving post 

router.post("/:id/save", isLogged, async (req, res, next) => {

    try {

        let existingSave = await SavedPost.findOne({
            user: req.user._id,
            post: req.params.id
        });


        if (existingSave) {
            await SavedPost.findOneAndDelete({

                user: req.user._id,
                post: req.params.id

            });
            return res.status(200).json({ saved: false });
        }


        let savedPost = await SavedPost.create({

            user: req.user._id,
            post: req.params.id

        });


        return res.status(201).json({
            savedPost,
            saved: true
        });


    }
    catch (err) {
        next(err);
    }

});


// show all saved
router.get("/saves", isLogged, async (req, res, next) => {

    try {

        let savedPosts = await SavedPost.find({
            user: req.user._id
        })
            .populate("post")
            .sort({
                createdAt: -1
            });


        return res.status(200).json(savedPosts);


    }
    catch (err) {
        next(err);
    }

});

// check if a post is saved 
router.get("/:id/save", isLogged, async (req, res, next) => {
    try {
        let saved = await SavedPost.findOne({
            user: req.user._id,
            post: req.params.id
        });
        return res.status(200).json({
            saved: !!saved
        });
    } catch (err) {
        next(err);
    }
});

// get single post
router.get("/:id", async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id).populate("author");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
