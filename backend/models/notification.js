const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notifSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
     ref: "User",
     required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
     ref: "User",
      required: true
    },
    notifType: {
        type: String,
        enum: ["like", "comment", "follow"],
         required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },

    // Optional
    post: {
          type: Schema.Types.ObjectId,
     ref: "Post",
    },
    comment: {
          type: Schema.Types.ObjectId,
     ref: "Comment",
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model("Notification", notifSchema);