const express = require("express");
const passport = require("passport");
const Comment = require("../models/comment.js");

module.exports = async function isCommentOwner(req, res, next) {
  try {
     let comment = await Comment.findById(req.params.id);
   if(!comment) return res.status(404).json({message: "Comment not found error 404"});

   if(req.user._id.equals(comment.id)) return next()
  }
  catch(err) {
    return res.status(404).json({message: "Something went wrong"});
  }
}