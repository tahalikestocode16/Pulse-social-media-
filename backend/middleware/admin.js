const express = require("express");
const User = require("../models/user.js");

module.exports = async function isAdmin(req, res, next) {
    if(req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({message: "access denied, unauthorized user"});

};