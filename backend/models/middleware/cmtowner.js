const express = require("express");
const passport = require("passport");
const Comment = require("../comment.js");

module.exports = async function isCommentOwner(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reqUserId = req.user._id ? req.user._id.toString() : "";
    const commentAuthorId = comment.author ? comment.author.toString() : "";

    if (reqUserId && commentAuthorId && reqUserId === commentAuthorId) {
      return next();
    }
    return res.status(403).json({ message: "Access denied. You can only edit or delete your own comments." });
  } catch (err) {
    console.log("isCommentOwner error:", err);
    return res.status(500).json({ message: "Comment owner check failed: " + err.message });
  }
};