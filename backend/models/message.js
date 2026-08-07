const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },

    readBy: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            readAt: {
                type: Date
            }
        }
    ],
    text: {
        type: String,
        required: true,
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model("Message", messageSchema);
