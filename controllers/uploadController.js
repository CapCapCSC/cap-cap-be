const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'food-images',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            const stream = Readable.from(req.file.buffer);
            stream.pipe(uploadStream);
        });

        res.json({
            success: true,
            url: result.secure_url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message,
        });
    }
};
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'avatar-images',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            const stream = Readable.from(req.file.buffer);
            stream.pipe(uploadStream);
        });
        return result;
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message,
        });
    }
};

module.exports = {
    uploadImage,
    uploadAvatar,
};
