import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteorders } from '../controllers/orders.controller.js';
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
const ordersValidation = validationConfig['orders'] || [
	body('order_id').optional(),
	body('customer_id').optional(),
	body('staff_id').optional(),
	body('total_amount').optional(),
	body('order_status').optional(),
	body('shipping_method_id').optional(),
	body('shipping_address').optional(),
	body('method_id').optional(),
	body('payment_status').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['orders'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['orders'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['orders'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['orders'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['orders'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['orders'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve a paginated list of orders
 *     description: Fetches a paginated list of orders from the database.
 *     tags: [Orders]
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
 *         description: A paginated list of orders
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
 *                       order_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       order_status:
 *                         type: string
 *                       shipping_method_id:
 *                         type: number
 *                       shipping_address:
 *                         type: string
 *                       method_id:
 *                         type: number
 *                       payment_status:
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
 * /api/v1/orders/all:
 *   get:
 *     summary: Retrieve all orders without pagination
 *     description: Fetches all orders from the database without pagination.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders
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
 *                       order_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       order_status:
 *                         type: string
 *                       shipping_method_id:
 *                         type: number
 *                       shipping_address:
 *                         type: string
 *                       method_id:
 *                         type: number
 *                       payment_status:
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
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Retrieve a single orders by ID
 *     description: Fetches a orders by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The orders ID
 *     responses:
 *       200:
 *         description: A single orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     order_status:
 *                       type: string
 *                     shipping_method_id:
 *                       type: number
 *                     shipping_address:
 *                       type: string
 *                     method_id:
 *                       type: number
 *                     payment_status:
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
 *         description: Orders not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...ordersValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...ordersValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteorders);
export default router;
