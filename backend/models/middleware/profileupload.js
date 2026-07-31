

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../../config/cloudinary.js");

let storage;
try {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => ({
            folder: "pulse-profile-pictures",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"]
        })
    });
} catch (e) {
    storage = multer.memoryStorage();
}

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

module.exports = upload;