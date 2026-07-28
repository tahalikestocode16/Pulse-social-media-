const express = require("express");
const router = express.Router();

const User = require("../models/user");
const isLogged = require("../models/middleware/authenticate.js");


// search users (last feature)
router.get("/search", isLogged, async (req, res, next) => {
    try {
        let currentUser = await User.findById(req.user._id);
        
        let searchedUser = await User.findOne({
            username: req.query.username
        }).select("-password");
        if (!searchedUser) {
            return res.status(404).json({ message: "User not found" });
        }
         let blocked =
            currentUser.blockedUsers.some(
                id => id.toString() === searchedUser._id.toString()
            )
            ||
            searchedUser.blockedUsers.some(
                id => id.toString() === currentUser._id.toString()
            );

        if(blocked) {
            return res.status(403).json({message: "cannot access profile"});
        }
        return res.status(200).json(searchedUser);
    }
    catch (err) {
        return next(err);
    }
});

// block user
router.patch("/:id/block", isLogged, async (req, res, next) => {

    try {

        let user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }


        // prevent blocking yourself
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                message: "you cannot block yourself"
            });
        }


        // already blocked
        if (user.blockedUsers.includes(req.params.id)) {
            return res.status(400).json({
                message: "user already blocked"
            });
        }


        user.blockedUsers.push(req.params.id);

        await user.save();


        return res.status(200).json({
            message: "user blocked"
        });

    }
    catch (err) {
        next(err);
    }

});




// unblock user
router.patch("/:id/unblock", isLogged, async (req, res, next) => {

    try {

        let user = await User.findById(req.user._id);


        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }


        user.blockedUsers = user.blockedUsers.filter(
            id => id.toString() !== req.params.id
        );


        await user.save();


        return res.status(200).json({
            message: "user unblocked"
        });

    }
    catch (err) {
        next(err);
    }

});




// check if blocked
router.get("/:id/block", isLogged, async (req, res, next) => {

    try {

        let user = await User.findById(req.user._id);


        let blocked = user.blockedUsers.includes(req.params.id);


        return res.status(200).json({
            blocked
        });

    }
    catch (err) {
        next(err);
    }
});


router.get("/me", isLogged, async (req, res, next)=> {
    try {
      let user = await User.findById(req.user._id);
      return res.status(200).json(user);
    }
    catch(err) {
        return next(err);
    }
});

module.exports = router;
