const express = require("express");
const Notification = require("../models/notification.js");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const router = express.Router();
const isLogged = require("../models/middleware/authenticate.js");


// Show notification
router.get("/", isLogged, async(req, res, next)=> {
    try {
        // find returns array findone returns doc findbyid returns doc
        let notifs = await Notification.find({
            receiver: req.user._id
        })
        .sort({createdAt: -1})
        .populate("sender")
        .populate("post")
        .populate("comment");
        // these methods are applied to the mongoose item before they are executed
    
       return res.status(200).json(notifs)
    }
    catch(err) {
        next(err);
    }
});

// Delete notification
router.delete("/:id", isLogged, async(req, res, next)=> {
    try {
        // we use ONE here since findbyid wont accept our queries it only accepts id
        let notifs = await Notification.findOneAndDelete({
            id: req.params.id,
            receiver: req.user._id
        });
        if(!notifs) {
            return res.status(404).json({message: "notification not found"});
        }
       return res.status(200).json({message: "notification removed"});
    }
    catch(err) {
        return next(err);
    }
});

module.exports = router;