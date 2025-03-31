import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteproducts } from '../controllers/products.controller.js';
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
const productsValidation = validationConfig['products'] || [
	body('product_id').optional(),
	body('product_name').optional(),
	body('brand_id').optional(),
	body('category_id').optional(),
	body('price').optional(),
	body('discount_price').optional(),
	body('description').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['products'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['products'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['products'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['products'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['products'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['products'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve a paginated list of products
 *     description: Fetches a paginated list of products from the database.
 *     tags: [Products]
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
 *         description: A paginated list of products
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
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *                       brand_id:
 *                         type: number
 *                       category_id:
 *                         type: number
 *                       price:
 *                         type: number
 *                       discount_price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       updated_at:
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
 * /api/v1/products/all:
 *   get:
 *     summary: Retrieve all products without pagination
 *     description: Fetches all products from the database without pagination.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all products
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
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *                       brand_id:
 *                         type: number
 *                       category_id:
 *                         type: number
 *                       price:
 *                         type: number
 *                       discount_price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       updated_at:
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
 * /api/v1/products/{id}:
 *   get:
 *     summary: Retrieve a single products by ID
 *     description: Fetches a products by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The products ID
 *     responses:
 *       200:
 *         description: A single products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     product_name:
 *                       type: string
 *                     brand_id:
 *                       type: number
 *                     category_id:
 *                       type: number
 *                     price:
 *                       type: number
 *                     discount_price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Products not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...productsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...productsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproducts);
export default router;
