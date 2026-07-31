const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const isLogged = require("../models/middleware/authenticate.js");
const isProfileOwner = require("../models/middleware/profileowner.js");
const upload = require("../models/middleware/profileupload.js");


// view self profile route (MUST be placed before /:id)
router.get("/me", isLogged, async (req, res, next) => {
    try {
        let profile = await User.findById(req.user._id).select("-password").lean();
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        const Post = require("../models/post.js");
        let posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
        profile.posts = posts;
        return res.status(200).json(profile);
    } catch (err) {
        return next(err);
    }
});

// view profile by ID route
router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let profile = await User.findById(id).select("-password").lean();
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        const Post = require("../models/post.js");
        let posts = await Post.find({ author: id }).sort({ createdAt: -1 });
        profile.posts = posts;
        return res.status(200).json(profile);
    } catch (err) {
        return next(err);
    }
});



// edit profile
// accept one profile pic 
router.patch("/edit", isLogged, isProfileOwner, upload.single("profilePic"), async (req, res, next)=> {
    try {
        console.log(req.file);
        let updates = {};

    if(req.body.username !== undefined) {
        updates.username = req.body.username;
    }
     if(req.body.bio !== undefined) {
        updates.bio = req.body.bio;
    }
    // here we use undefined comparision because req.body wil always exist we have to see if it
    // has anything inside it

    if(req.file) {
        updates.profilePic = req.file.path;
    }
    // req.file comes from cloudinary after we upload the image so if no image no Route btu can write
    // req.file !== undefined it will do the exact same thing
    //  removed pfp route due to using multer
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: updates
    },
    {
        runValidators: true,
        new: true
    });
     res.status(200).json(updatedUser);
    }
    catch(err) {
        next(err);
    }
   
});
// set and updates is a function of js that updates the given value using it with if makes it if that
// value was changed it will be updates, and !== undefined will make sure to handle if the input is invalid
// yes im actually writing all of this at 4:50 am


// delete account route
router.delete("/delete", isLogged, isProfileOwner, async (req, res, next)=> {
    try {
        let user = await User.findByIdAndDelete(req.user._id);
        if(!user) {
            return res.status(404).json({message: "user not found errorcode 404"});
        }
       return res.status(200).json({message: "succesfully deleted your account"});
    }
    catch(err) {
        return next(err);
    }
  
});
// in future i will add a popup in frontend that asks if youre sure


// router.get("/users/:id", async (req, res)=> {
//     let user = await User.findById(req.params.id);
//     let following = user.following.populate('username', "profilePic");
//     let followers = user.followers.populate('username', "profilePic");

//     res.json([user, following, followers]);
// })


// =================================== FOLLOWING AND FOLLOWERS ================================

router.post("/:id/follow", isLogged, async (req, res, next)=> {
   try {
        const toFollow = await User.findById(req.params.id);
    const Follower = await User.findById(req.user._id);

    if(!toFollow) {
        return res.status(404).json({message: "user not found"});
    }

    if(req.user._id.equals(req.params.id)) {
        return res.status(403).json({message: "you cant follow yourself"});
    }

    if(Follower.following.some(id => id.equals(req.params.id))) {
       return res.status(403).json({message: "already following"});
    //    id here is not syntax write whatever you want
    }
    // return on errors is needed else it will execute the code ahead even the success responses

    Follower.following.push(toFollow._id);
    toFollow.followers.push(Follower._id);

    await Follower.save();
    await toFollow.save();

    try {
        const Notification = require("../models/notification.js");
        await Notification.create({
            sender: req.user._id,
            receiver: toFollow._id,
            notifType: "follow",
            type: "follow",
        });
    } catch(notifErr) {
        console.log("Follow notification error:", notifErr);
    }

   return res.status(200).json({message : "following"});
}
    catch(err) {
        return next(err);
    };
});


// unfollow route
router.delete("/:id/unfollow", isLogged, async (req, res, next)=> {
   try {
     const toUnfollow = await User.findById(req.params.id);
     const currentUser = await User.findById(req.user._id);
     
     if(!toUnfollow) {
        return res.status(404).json({message: "no user defined"});
     }
     if(!currentUser.following.some(id => id.equals(req.params.id))) {
        return res.status(400).json({message: "you arent following this user"});
     }
     if(req.user._id.equals(req.params.id)) {
        return res.status(403).json({message: "you cant unfollow yourself"});
     }
       currentUser.following.pull(toUnfollow._id);
       toUnfollow.followers.pull(req.user._id);

       await currentUser.save();
       await toUnfollow.save();

        return res.status(200).json({message: "unfollowed"});
     
   } catch(err) {
      return next(err);
   }
});

// block route
router.post("/:id/block", isLogged, async(req, res, next)=> {
    res.json({message: "under development"})
});

// GET user's followers list
router.get("/:id/followers", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "username profilePic bio followers");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user.followers || []);
    } catch (err) {
        return next(err);
    }
});

// GET user's following list
router.get("/:id/following", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate("following", "username profilePic bio followers");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user.following || []);
    } catch (err) {
        return next(err);
    }
});

// GET user's saved posts
router.get("/:id/saved", async (req, res, next) => {
    try {
        const SavedPost = require("../models/savedpost.js");
        const savedDocs = await SavedPost.find({ user: req.params.id }).populate({
            path: "post",
            populate: { path: "author", select: "username profilePic" }
        });
        const posts = savedDocs.map(d => d.post).filter(Boolean);
        return res.status(200).json(posts);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;