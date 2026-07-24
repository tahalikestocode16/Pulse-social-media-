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
      if(!userB) {
        return res.status(404).json({message: "User does not exist"});
      }

     let convo = await Conversation.findOne({
         participants: {
            $all: [userA, userB]
         }
      });
      // this is the same as get fucntion ye TWO users jitni bhi convos mai aik sath hain wo dikhado
      // have one issue agar mai apna aur apne dost ka aik dm kholunga to chaljayega ye lekin if we added gc this would need 
      // more work since then two users can be in many convos we would have to do length 2 se ziada na ho
      if(!convo) {
          convo = await Conversation.create({
            participants: [userA, userB]
         });
        return res.status(200).json(convo);
      }
      return res.status(201).json(convo);
  }
  catch(err) {
    return next(err);
  }
});


// is user ki jitni conversations hain wo return krdo as array and convo array we send to frontend
// GET conversations 
router.get("/", isLogged, async (req, res, next)=> {
    try {
      let convo = await Conversation.find({
           participants: {
            $in: [req.user._id]
            // in expects an array
           }
      }).populate("lastMessage").sort({createdAt: -1});
      if(convo.length < 1) {
        return res.status(200).json({message: "no conversations"});
      }
         return res.status(200).json(convo);
    }
    catch(err) {
       return next(err);
    }
})

module.exports = router;