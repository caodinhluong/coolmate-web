import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteproduct_images } from '../controllers/product_images.controller.js';
import { body, param, validationResult } from 'express-validator';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import validationConfig from '../common/validationConfig.js';
import routeConfig from '../common/routeConfig.js';
import logger from '../common/logger.js';

const router = express.Router();
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		logger.warn(`Validation failed for ${tableName}: ${JSON.stringify(errors.array())}`, { method: req.method, url: req.url });
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
const product_imagesValidation = validationConfig['product_images'] || [
	body('image_id').optional(),
	body('product_id').optional(),
	body('image_url').optional(),
	body('is_primary').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['product_images'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['product_images'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['product_images'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['product_images'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['product_images'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['product_images'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/product_images:
 *   get:
 *     summary: Retrieve a paginated list of product_images
 *     description: Fetches a paginated list of product_images from the database.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: A paginated list of product_images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       image_url:
 *                         type: string
 *                       is_primary:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/', [...getAllMiddleware], getAll);

/**
 * @swagger
 * /api/v1/product_images/all:
 *   get:
 *     summary: Retrieve all product_images without pagination
 *     description: Fetches all product_images from the database without pagination.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all product_images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       image_url:
 *                         type: string
 *                       is_primary:
 *                         type: number
 *                       created_at:
 *                         type: string
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/all', [...getAllWithoutPaginationMiddleware], getAllWithoutPagination);

/**
 * @swagger
 * /api/v1/product_images/{id}:
 *   get:
 *     summary: Retrieve a single product_images by ID
 *     description: Fetches a product_images by its ID.
 *     tags: [Product_images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_images ID
 *     responses:
 *       200:
 *         description: A single product_images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     image_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     image_url:
 *                       type: string
 *                     is_primary:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product_images not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...product_imagesValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_imagesValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_images);
export default router;
