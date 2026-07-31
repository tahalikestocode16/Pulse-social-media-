const express = require("express");
const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const router = express.Router();
const isLogged = require("../models/middleware/authenticate.js");

// Open/Create conversation
router.post("/", isLogged, async (req, res, next) => {
  try {
    let userA = req.user._id;
    let userB = req.body.userId;
    if (!userB) {
      return res.status(404).json({ message: "User does not exist" });
    }

    let convo = await Conversation.findOne({
      participants: {
        $all: [userA, userB]
      }
    }).populate("participants", "username profilePic").populate("lastMessage");

    if (!convo) {
      convo = await Conversation.create({
        participants: [userA, userB]
      });
      convo = await convo.populate("participants", "username profilePic");
      return res.status(200).json(convo);
    }
    return res.status(200).json(convo);
  } catch (err) {
    return next(err);
  }
});

// GET conversations for logged-in user
router.get("/", isLogged, async (req, res, next) => {
  try {
    let convo = await Conversation.find({
      participants: {
        $in: [req.user._id]
      }
    })
      .populate("participants", "username profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json(convo || []);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;