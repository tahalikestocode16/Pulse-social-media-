

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const postStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "pulse-posts",
        resource_type: "auto",
        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "mp4",
            "mov",
            "webm"
        ]
    })
});

module.exports = {
    cloudinary,
    postStorage
};