import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletetransactions } from '../controllers/transactions.controller.js';
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
const transactionsValidation = validationConfig['transactions'] || [
	body('transaction_id').optional(),
	body('order_id').optional(),
	body('method_id').optional(),
	body('amount').optional(),
	body('transaction_status').optional(),
	body('transaction_date').optional(),
	body('transaction_code').optional(),
];
const getAllMiddleware = routeConfig['transactions'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['transactions'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['transactions'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['transactions'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['transactions'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['transactions'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Retrieve a paginated list of transactions
 *     description: Fetches a paginated list of transactions from the database.
 *     tags: [Transactions]
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
 *         description: A paginated list of transactions
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
 *                       transaction_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       method_id:
 *                         type: number
 *                       amount:
 *                         type: number
 *                       transaction_status:
 *                         type: string
 *                       transaction_date:
 *                         type: string
 *                       transaction_code:
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
 * /api/v1/transactions/all:
 *   get:
 *     summary: Retrieve all transactions without pagination
 *     description: Fetches all transactions from the database without pagination.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all transactions
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
 *                       transaction_id:
 *                         type: number
 *                       order_id:
 *                         type: number
 *                       method_id:
 *                         type: number
 *                       amount:
 *                         type: number
 *                       transaction_status:
 *                         type: string
 *                       transaction_date:
 *                         type: string
 *                       transaction_code:
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
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Retrieve a single transactions by ID
 *     description: Fetches a transactions by its ID.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transactions ID
 *     responses:
 *       200:
 *         description: A single transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction_id:
 *                       type: number
 *                     order_id:
 *                       type: number
 *                     method_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     transaction_status:
 *                       type: string
 *                     transaction_date:
 *                       type: string
 *                     transaction_code:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Transactions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...transactionsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...transactionsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletetransactions);
export default router;
