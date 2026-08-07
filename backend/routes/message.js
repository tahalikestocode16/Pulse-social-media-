const express = require("express");
const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const router = express.Router();
const isLogged = require("../models/middleware/authenticate.js");

// Send a new message
router.post("/:id", isLogged, async (req, res, next) => {
  try {
    let convo = await Conversation.findById(req.params.id).populate("participants");

    if (!convo) {
      return res.status(404).json({ message: "Conversation does not exist" });
    }

    let otherUser = convo.participants.find(
      user => user._id.toString() !== req.user._id.toString()
    );

    if (
      otherUser &&
      ((req.user.blockedUsers || []).some(id => id.toString() === otherUser._id.toString()) ||
       (otherUser.blockedUsers || []).some(id => id.toString() === req.user._id.toString()))
    ) {
      return res.status(403).json({ message: "Account unavailable" });
    }

    // Create message doc and populate sender
    let message = await Message.create({
      sender: req.user._id,
      text: req.body.text,
      isRead: false,
      conversation: req.params.id
    });

    message = await message.populate("sender", "username profilePic");

    // Realtime socket emit
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("newPulse", message);
    }

    // Update conversation lastMessage & timestamp
    convo.lastMessage = message._id;
    await convo.save();

    return res.status(201).json(message);
  } catch (err) {
    return next(err);
  }
});

// GET all messages in a conversation
router.get("/:id", isLogged, async (req, res, next) => {
  try {
    let convo = await Conversation.findById(req.params.id);
    if (!convo) {
      return res.status(200).json([]);
    }
    let messages = await Message.find({
      conversation: convo._id
    }).populate("sender", "username profilePic").sort({ createdAt: 1 });

    return res.status(200).json(messages || []);
  } catch (err) {
    return next(err);
  }
});

// Delete message
router.delete("/:id", isLogged, async (req, res, next) => {
  try {
    let message = await Message.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: "Message does not exist" });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(message.conversation.toString()).emit("messageDeleted", {
        messageId: message._id
      });
    }

    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    return next(err);
  }
});

// Edit message
router.patch("/:id", isLogged, async (req, res, next) => {
  try {
    let text = req.body.text;
    if (!text) {
      return res.status(400).json({ message: "You didn't update anything" });
    }
    let message = await Message.findOneAndUpdate(
      {
        _id: req.params.id,
        sender: req.user._id,
      },
      {
        text: text,
      },
      {
        new: true,
      }
    ).populate("sender", "username profilePic");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(message.conversation.toString()).emit("messageUpdated", message);
    }

    return res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
