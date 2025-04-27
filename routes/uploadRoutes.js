const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadImage } = require('../controllers/uploadController');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload images to Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Error due to missing file or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadError'
 */
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
