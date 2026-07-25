const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Post = require("../models/post.js");
const isLogged = require("../middleware/authenticate.js");
const isPostOwner = require("../middleware/postowner.js");
const postUpload = require("../middleware/postupload.js");
const SavedPost = require("../models/savedpost.js");

// POST  / general feed
router.get("/fyp", async (req, res) => {
    try {
        if (req.user) {
            let currentUser = await User.findById(req.user._id);
            currentUser.following.push(req.user._id);
            // also exclude posts from users you blocked
            let excluded = [
                ...currentUser.following,
                ...currentUser.blockedUsers
            ];
            let post = await Post.find({
                author: { $nin: excluded }
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
                    $addFields: {
                        likeCount: { $size: "$likes"}
                    }
                },
                {
                    sort: {
                        likeCount: -1, 
                        // highest likes first -1 means descending 100> 50> 10 1 would be opposite 10> 50> 100
                        createdAt: -1
                        // if same likes newest first 
                        // for dates old date smaller number new date bigger number thats why we 
                        // here are putting -1
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
            author: { $in: following, $nin: currentUser.blockedUsers }
        });
        return res.status(200).json(post);

    }
    catch (err) {
        return res.status(400).json("feed not available try refreshing");
    }

});

// Create route
router.post("/create", isLogged, postUpload.single("media"), async (req, res, next) => {
   try {
     let { content, title } = req.body;
    let author = req.user._id;
    let mediaUrl = undefined;
    let mediaType = undefined;
    if(req.file) {
        mediaUrl = req.file.path;
        mediaType =  req.file.resource_type;
    }
    await Post.create({
        title,
        content,
        author,
        mediaUrl,
        mediaType
    });
   return res.json({ message: "Post created" });
   }
   catch(err) {
    return next(err);
   }
});

// Edit route 
router.patch("/:id", isLogged, isPostOwner, async (req, res, next) => {
   try {
     let { content, title } = req.body;
     let id = req.params.id;
   let post = await Post.findByIdAndUpdate(id, {
        content: content,
        title: title,
    });
    if(!post) {
        return res.status(404).json({message: "post not found"});
    }
    return res.json({ message: "post succesfully updated" });

   }

   catch(err) {
    return next(err);
   }
})

// Delete route
router.delete("/:id", isLogged, isPostOwner, async (req, res, next) => {
  try {
      let id = req.params.id;
   let post = await Post.findByIdAndDelete(id);
    if(!post) {
        return res.status(404).json({message: "post not found"});
    }
    return res.json({ message: "Post deleted" });

  }
  catch(err) {
    return next(err);
  }
});
// will add deleting from admin panel or as admin later


// ========================================= likes ===========================================

router.post("/:id/like", isLogged, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: " post does not exist " });
        }
        let currentUser = await User.findById(req.user._id);
        if (currentUser.blockedUsers.includes(post.author.toString())) {
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
        }
        await post.save();
        return res.status(200).json(message);
    }
    catch (err) {
        return next(err);
    }
});


// ===================================== SAVING POSTS ==========================================
// saving post 

router.post("/:id/save", isLogged, async(req,res,next)=>{

    try{

        let existingSave = await SavedPost.findOne({
            user: req.user._id,
            post: req.params.id
        });


        if(existingSave){
            return res.status(400).json({
                message:"post already saved"
            });
        }


        let savedPost = await SavedPost.create({

            user: req.user._id,
            post: req.params.id

        });


        return res.status(201).json(savedPost);


    }
    catch(err){
        next(err);
    }

});

// unsave 

router.delete("/:id/save", isLogged, async(req,res,next)=>{

    try{

        let savedPost = await SavedPost.findOneAndDelete({

            user:req.user._id,
            post:req.params.id

        });


        if(!savedPost){
            return res.status(404).json({
                message:"saved post not found"
            });
        }


        return res.status(200).json({
            message:"post unsaved"
        });


    }
    catch(err){
        next(err);
    }

});

// show all saved
router.get("/", isLogged, async(req,res,next)=>{

    try{

        let savedPosts = await SavedPost.find({
            user:req.user._id
        })
        .populate("post")
        .sort({
            createdAt:-1
        });


        return res.status(200).json(savedPosts);


    }
    catch(err){
        next(err);
    }

});

// check if a post is saved 
router.get("/:id/save", isLogged, async(req,res,next)=>{

    try{

        let saved = await SavedPost.findOne({

            user:req.user._id,
            post:req.params.id

        });


        return res.status(200).json({
            saved: !!saved
        });


    }
    catch(err){
        next(err);
    }

});
module.exports = router;
