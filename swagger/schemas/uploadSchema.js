/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Trạng thái upload
 *           example: true
 *         url:
 *           type: string
 *           description: URL của ảnh sau khi upload
 *           example: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/food-images/example.jpg
 *     UploadError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Trạng thái upload
 *           example: false
 *         message:
 *           type: string
 *           description: Thông báo lỗi
 *           example: Error uploading image
 *         error:
 *           type: string
 *           description: Chi tiết lỗi
 *           example: Invalid file type
 */
