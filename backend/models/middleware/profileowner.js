const express = require("express");
const passport = require("passport");
const User = require("../user.js"); 

module.exports = async function isProfileOwner(req, res, next) {
    try {
        if (!req.user) return res.status(401).json({ message: "User not authenticated" });
        const targetId = req.params.id || req.user._id;
        if (!targetId) return res.status(400).json({ message: "User ID required" });

        const user = await User.findById(targetId);
        if (!user) return res.status(404).json({ message: "User does not exist" });

        const reqUserId = req.user._id ? req.user._id.toString() : "";
        const targetUserId = user._id ? user._id.toString() : "";

        if (reqUserId && reqUserId === targetUserId) {
            return next();
        }
        return res.status(403).json({ message: "Access denied unauthorized user" });
    } catch(err) {
        console.log("isProfileOwner error:", err);
        return res.status(500).json({ message: "Profile owner check failed: " + err.message });
    }
};
