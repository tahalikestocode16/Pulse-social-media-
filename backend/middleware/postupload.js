const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "pulse/posts",
        resource_type: "auto",
        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "mp4",
            "mov",
            "webm"
        ]
    })
});

const postupload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    }
});

module.exports = postupload;