const express = require("express");
const passport = require("passport");
const Comment = require("../models/comment.js");

module.exports = async function isCommentOwner(req, res, next) {
  try {
     let comment = await Comment.findById(req.params.id);
   if(!comment) return res.status(404).json({message: "Comment not found error 404"});

    
  }
  catch(err) {
    return next(err)
  }
    
  
}