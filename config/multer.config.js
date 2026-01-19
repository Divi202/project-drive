const multer = require("multer");

// 1. Initialize Multer with Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
