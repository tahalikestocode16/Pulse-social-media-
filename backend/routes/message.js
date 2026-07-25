const express = require("express");
const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const router = express.Router();
const isLogged = require("../middleware/authenticate.js");

// send a new message
router.post("/:id", isLogged, async (req, res, next) => {
    try {

        // find conversation
        let convo = await Conversation.findById(req.params.id)
            .populate("participants");


        if (!convo) {
            return res.status(403).json({
                message: "conversation does not exist"
            });
        }


        // find the other user in conversation
        let otherUser = convo.participants.find(
            user => user._id.toString() !== req.user._id.toString()
        );


        // block check (both directions)
        if (
            req.user.blockedUsers.some(
                id => id.toString() === otherUser._id.toString()
            )
            ||
            otherUser.blockedUsers.some(
                id => id.toString() === req.user._id.toString()
            )
        ) {
            return res.status(403).json({
                message: "account unavailable"
            });
        }


        // create message
        let message = await Message.create({
            sender: req.user._id,
            text: req.body.text,
            isRead: false,
            conversation: req.params.id
        });


        // realtime socket emit
        let io = req.app.get("io");

        io.to(req.params.id).emit(
            "newPulse",
            message
        );


        // update conversation last message
        convo.lastMessage = message._id;

        await convo.save();


        return res.status(201).json(message);

    }
    catch (err) {
        return next(err);
    }
});
// get all messages when opening a convo
// messages will be called pulse a new pulse eg
router.get("/:id", isLogged, async (req, res, next) => {
    try {
        let convo = await Conversation.findById(req.params.id);
        if (!convo) {
            return res.status(200).json({ message: "conversation does not exist, spark a pulse!" });
        }
        let messages = await Message.find({
            conversation: convo._id
        });
        // wo sare msg lado jisme ye convo id


        if (messages.length < 1) {
            return res.status(200).json({ message: "no messages yet start your first conversation, beggining of a pulse!" })
        }
        return res.status(200).json(messages);
    }
    catch (err) {
        return next(err);
    }
});

// delete messages 
router.delete("/:id", isLogged, async (req, res, next) => {
    try {
        let message = await Message.findOneIdAndDelete({
            _id: req.params.id,
            sender: req.user._id
        });
        const io = req.app.get("io");

        io.to(message.conversation.toString())
            .emit("messageDeleted", {
                messageId: message._id
            });
        //    find by delete mai agar pehle pass krdoge id to wo valiations run nahi krega isliye findONE
        if (!message) {
            return res.status(404).json({ message: "message does not exist" });
        }
        return res.status(200).json({ message: "message deleted" });
    }
    catch (err) {
        return next(err);
    }
});

// edit message
router.patch("/:id", isLogged, async (req, res, next) => {
    try {
        let text = req.body.text;
        if (!text) {
            return res.status(400).json({ message: "you didnt update anything" });
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
        );
        const io = req.app.get("io");

        io.to(message.conversation.toString())
            .emit("messageUpdated", message);
        if (!message) {
            return res.status(404).json({ message: "message not found" });
        }
        return res.status(200).json(message);
    }
    catch (err) {
        return next(err);
    }
});

router.patch("/:id/read", isLogged, async (req, res, next) => {

    try {

        let message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                message: "message not found"
            });
        }


        let alreadyRead = message.readBy.find(
            (reader) => reader.user.toString() === req.user._id.toString()
        );


        if (alreadyRead) {
            return res.status(200).json({
                message: "already read"
            });
        }


        message.readBy.push({
            user: req.user._id,
            readAt: new Date()
        });


        await message.save();
        const io = req.app.get("io");


        io.to(message.conversation.toString())
            .emit("messageRead", {
                messageId: message._id,
                userId: req.user._id,
                readAt: new Date()
            });


        return res.status(200).json(message);


    }
    catch (err) {
        next(err);
    }

});

router.patch("/:conversationId/read", isLogged, async(req,res,next)=>{
    try {

        await Message.updateMany(
            {
                conversation: req.params.conversationId,
                sender: { $ne: req.user._id },
                isRead: false
            },
            {
                isRead: true
            }
        );


        const io = req.app.get("io");

        io.to(req.params.conversationId)
        .emit("messagesRead", {
            userId: req.user._id
        });


        return res.status(200).json({
            message:"messages marked read"
        });

    }
    catch(err){
        next(err);
    }
});

module.exports = router;
