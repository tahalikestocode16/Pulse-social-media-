

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pulse/profile-pictures",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
 });

module.exports = upload;