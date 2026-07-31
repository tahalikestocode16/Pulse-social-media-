const express = require("express");
const passport = require("passport");
const Comment = require("../comment.js");

module.exports = async function isCommentOwner(req, res, next) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user && req.user._id && comment.author && req.user._id.equals(comment.author)) {
      return next();
    }
    return res.status(403).json({ message: "Access denied. You can only edit or delete your own comments." });
  } catch (err) {
    return res.status(400).json({ message: "Invalid comment ID or server error" });
  }
};