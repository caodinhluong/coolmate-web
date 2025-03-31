import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletecart_items } from '../controllers/cart_items.controller.js';
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
const cart_itemsValidation = validationConfig['cart_items'] || [
	body('cart_item_id').optional(),
	body('cart_id').optional(),
	body('product_size_id').optional(),
	body('quantity').optional(),
];
const getAllMiddleware = routeConfig['cart_items'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['cart_items'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['cart_items'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['cart_items'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['cart_items'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['cart_items'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/cart_items:
 *   get:
 *     summary: Retrieve a paginated list of cart_items
 *     description: Fetches a paginated list of cart_items from the database.
 *     tags: [Cart_items]
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
 *         description: A paginated list of cart_items
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
 *                       cart_item_id:
 *                         type: number
 *                       cart_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       quantity:
 *                         type: number
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
 * /api/v1/cart_items/all:
 *   get:
 *     summary: Retrieve all cart_items without pagination
 *     description: Fetches all cart_items from the database without pagination.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all cart_items
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
 *                       cart_item_id:
 *                         type: number
 *                       cart_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       quantity:
 *                         type: number
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
 * /api/v1/cart_items/{id}:
 *   get:
 *     summary: Retrieve a single cart_items by ID
 *     description: Fetches a cart_items by its ID.
 *     tags: [Cart_items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart_items ID
 *     responses:
 *       200:
 *         description: A single cart_items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_item_id:
 *                       type: number
 *                     cart_id:
 *                       type: number
 *                     product_size_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Cart_items not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...cart_itemsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...cart_itemsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecart_items);
export default router;
