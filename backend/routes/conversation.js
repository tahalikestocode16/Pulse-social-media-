const express = require("express");
const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const router = express.Router();
const isLogged = require("../middleware/authenticate.js");


// Open conversation
router.post("/", isLogged, async (req, res, next)=> {
  try{
      let userA = req.user_.id;
      let userB = req.body.userId;

     let convo = await Conversation.findOne({
         participants: {
            $all: [userA, userB]
         }
      });
      if(!convo) {
          convo = await Conversation.create({
            participants: [userA, userB]
         });
        return res.status(200).json(convo)
      }
      return res.status(200).json(convo);
  }
  catch(err) {
    return next(err);
  }
});

// GET conversations 
router.get("/", isLogged, async (req, res, next)=> {
    try {
      let convo = await Conversation.find({
           participants: {
            $in: req.user._id
           }
      })
    }
    catch(err) {
       return next(err);
    }
})

module.exports = router;