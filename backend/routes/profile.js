const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const isLogged = require("../middleware/authenticate.js");
const isProfileOwner = require("../middleware/profileowner.js");


// view profile route
router.get("/:id", isLogged, isProfileOwner, async (req, res)=> {
    let { id } = req.params;
    let profile = await User.findById(id);
    res.status(200).json(profile);
});


// edit profile

router.patch("/edit", isLogged, isProfileOwner, async (req, res, next)=> {
    try {
        let updates = {};

    if(req.body.username !== undefined) {
        updates.username = req.body.username;
    }
     if(req.body.bio !== undefined) {
        updates.bio = req.body.bio;
    }
     if(req.body.profilePic !== undefined) {
        updates.profilePic = req.body.profilePic;
    }


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