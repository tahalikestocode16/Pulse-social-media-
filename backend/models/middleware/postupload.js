const multer = require("multer");

const storage = multer.memoryStorage();

const postupload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB
    }
});

module.exports = postupload;