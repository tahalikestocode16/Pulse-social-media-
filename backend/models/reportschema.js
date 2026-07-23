const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new Schema(
{
    reporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    targetType: {
        type: String,
        enum: ["post", "comment", "user"],
        required: true,
    },

    targetId: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    reason: {
        type: String,
        enum: [
            "spam",
            "harassment",
            "hate",
            "violence",
            "nudity",
            "misinformation",
            "other"
        ],
        required: true,
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ["pending", "reviewed", "rejected"],
        default: "pending",
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Report", reportSchema);