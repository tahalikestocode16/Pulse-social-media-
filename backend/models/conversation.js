const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const convoSchema = new Schema({
   participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
   }],
   lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
   },
  
}, {
    timestamps: true,
});

module.exports = mongoose.model("Conversation", convoSchema);
