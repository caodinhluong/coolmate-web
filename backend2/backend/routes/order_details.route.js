import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteorder_details } from '../controllers/order_details.controller.js';
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
const order_detailsValidation = validationConfig['order_details'] || [
	body('detail_id').optional(),
	body('order_id').optional(),
	body('product_size_id').optional(),
	body('quantity').optional(),
	body('price').optional(),
	body('warehouse_id').optional(),
];
const getAllMiddleware = routeConfig['order_details'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['order_details'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['order_details'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['order_details'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['order_details'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['order_details'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/order_details:
 *   get:
 *     summary: Retrieve a paginated list of order_details
 *     description: Fetches a paginated list of order_details from the database.
 *     tags: [Order_details]
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
 *         description: A paginated list of order_details
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
 *                       detail_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       warehouse_id:
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
 * /api/v1/order_details/all:
 *   get:
 *     summary: Retrieve all order_details without pagination
 *     description: Fetches all order_details from the database without pagination.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all order_details
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
 *                       detail_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       warehouse_id:
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
 * /api/v1/order_details/{id}:
 *   get:
 *     summary: Retrieve a single order_details by ID
 *     description: Fetches a order_details by its ID.
 *     tags: [Order_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order_details ID
 *     responses:
 *       200:
 *         description: A single order_details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     product_size_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order_details not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...order_detailsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...order_detailsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteorder_details);
export default router;
