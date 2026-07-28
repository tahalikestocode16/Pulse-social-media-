const express = require("express");
const passport = require("passport");
const Post = require("../post.js");
 
module.exports = async function isPostOwner(req, res, next) {
   try {
   let post =  await Post.findById(req.params.id);
   if(!post) return res.status(404).json({message: "post not found error 404"});

   if(req.user._id.equals(post.author)) return next();
   return res.status(403).json({message: "code 403 forbidden access"});
   } 

   catch(err) {
    return res.status(404).json({message: "Post not found invalid parameters"});
   }
};
// here we will use bjectId.equals() method because === and == will often fail so we use this e
// method to compare the values

// author is also an object id so we arent usind post.author.id


// ======== REMOVED
// populate was used because author is only stored is an object reference we populate it to gain access 
// to full data
