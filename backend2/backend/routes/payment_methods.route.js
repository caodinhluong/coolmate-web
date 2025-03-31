import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletepayment_methods } from '../controllers/payment_methods.controller.js';
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
const payment_methodsValidation = validationConfig['payment_methods'] || [
	body('method_id').optional(),
	body('method_name').optional(),
	body('description').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['payment_methods'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['payment_methods'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['payment_methods'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['payment_methods'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['payment_methods'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['payment_methods'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/payment_methods:
 *   get:
 *     summary: Retrieve a paginated list of payment_methods
 *     description: Fetches a paginated list of payment_methods from the database.
 *     tags: [Payment_methods]
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
 *         description: A paginated list of payment_methods
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
 *                       method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       is_active:
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
 * /api/v1/payment_methods/all:
 *   get:
 *     summary: Retrieve all payment_methods without pagination
 *     description: Fetches all payment_methods from the database without pagination.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all payment_methods
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
 *                       method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       is_active:
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
 * /api/v1/payment_methods/{id}:
 *   get:
 *     summary: Retrieve a single payment_methods by ID
 *     description: Fetches a payment_methods by its ID.
 *     tags: [Payment_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payment_methods ID
 *     responses:
 *       200:
 *         description: A single payment_methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Payment_methods not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...payment_methodsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...payment_methodsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletepayment_methods);
export default router;
