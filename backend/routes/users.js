const express = require("express");
const router = express.Router();

const User = require("../models/user");
const isLogged = require("../models/middleware/authenticate.js");


// search users (partial case-insensitive matching)
router.get("/search", async (req, res, next) => {
    try {
        const queryTerm = req.query.username ? req.query.username.trim() : "";
        if (!queryTerm) {
            return res.status(200).json([]);
        }

        let filter = { username: { $regex: queryTerm, $options: "i" } };

        if (req.user) {
            const currentUser = await User.findById(req.user._id);
            if (currentUser && currentUser.blockedUsers && currentUser.blockedUsers.length > 0) {
                filter._id = { $nin: currentUser.blockedUsers };
            }
        }

        const searchedUsers = await User.find(filter)
            .select("username profilePic bio followers")
            .limit(10);

        if (!searchedUsers || searchedUsers.length === 0) {
            return res.status(404).json({ message: "No matching users found" });
        }

        return res.status(200).json(searchedUsers);
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

// Suggested users — top accounts by follower count
router.get("/suggestions", async (req, res, next) => {
    try {
        const matchStage = req.user ? { _id: { $ne: req.user._id } } : {};
        const users = await User.aggregate([
            { $match: matchStage },
            { $project: { username: 1, profilePic: 1, bio: 1, followers: 1, followerCount: { $size: { $ifNull: ["$followers", []] } } } },
            { $sort: { followerCount: -1 } },
            { $limit: 8 }
        ]);
        return res.status(200).json(users || []);
    } catch(err) {
        return next(err);
    }
});

module.exports = router;
