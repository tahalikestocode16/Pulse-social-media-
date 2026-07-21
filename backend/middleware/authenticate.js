const express = require("express");
const passport = require("passport");

module.exports = function isLogged(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
      return res.status(401).json({message: "User not logged in"});
};

