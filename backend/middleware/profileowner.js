const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");

module.exports = async function isProfileOwner(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message: "user does not exist"});

        if(req.user._id.equals(user._id)) return next();
        return res.status(403).json({message: "Access denied unauthorized user"});
    }
    catch(err) {
        res.status(404).json({message: "profile not found inavlid credentials"});
    }
};

