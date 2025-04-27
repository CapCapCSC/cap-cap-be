const multer = require('multer');

// Cấu hình storage cho multer
const storage = multer.memoryStorage();

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // giới hạn 5MB
    },
});

module.exports = upload;
