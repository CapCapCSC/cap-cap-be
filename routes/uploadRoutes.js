const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadImage } = require('../controllers/uploadController');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload ảnh lên Cloudinary
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
 *                 description: File ảnh cần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Lỗi do không có file hoặc file không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadError'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadError'
 */
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
