const express = require("express");
const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const router = express.Router();
const isLogged = require("../middleware/authenticate.js");

// send a new message

router.post("/:id", isLogged, async(req, res, next)=> {
   try {
    let convo = await Conversation.findOne(req.params.id);
    if(!convo) {
        return res.status(403).json({message: "conversation does not exist"});
    }
       let message = await Message.create({
        sender: req.user._id,
        isRead: false,
        message: req.body.text,
        conversation: req.params.id
    });
    // you can use = while updating an object but not while creating
    convo.lastMessage = message
    await convo.save();
    return res.status(201).json(message);

   }
   catch(err) {
    return next(err);
   }
});

// get all messages when opening a convo
// messages will be called pulse a new pulse eg
router.get("/:id", isLogged, async (req, res, next)=> {
    try {
       let convo = await Conversation.findById(req.params.id);
       if(!convo) {
        return res.status(200).json({message: "conversation does not exist, spark a pulse!"});
       }
        let messages = await Message.find({
            conversation: convo._id
        });
        // wo sare msg lado jisme ye convo id

        
        if(messages.length < 1) {
            return res.status(200).json({message: "no messages yet start your first conversation, beggining of a pulse!"})
        }
        return res.status(200).json(messages);
    }
    catch(err) {
        return next(err);
    }
});

// delete messages 
router.delete("/:id", isLogged, async (req, res, next)=> {
    try{
       let message = await Message.findOneIdAndDelete({
           _id: req.params.id,
           sender: req.user._id
       });
    //    find by delete mai agar pehle pass krdoge id to wo valiations run nahi krega isliye findONE
       if(!message) {
        return res.status(404).json({message: "message does not exist"});
       }
       return res.status(200).json({message: "message deleted"});
    }
    catch(err) {
        return next(err);
    }
});

// edit message
router.patch("/:id", isLogged, async (req, res, next)=> {
    try {
        let text = req.body.text;
        if(!text) {
            return res.status(400).json({message: "you didnt update anything"});
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
      if(!message) {
        return res.status(404).json({message: "message not found"});
      }
      return res.status(200).json(message);
    }
    catch(err) {
        return next(err);
    }
});

module.exports = router;
