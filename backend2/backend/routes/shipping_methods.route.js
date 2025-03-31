import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteshipping_methods } from '../controllers/shipping_methods.controller.js';
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
const shipping_methodsValidation = validationConfig['shipping_methods'] || [
	body('shipping_method_id').optional(),
	body('method_name').optional(),
	body('cost').optional(),
	body('estimated_delivery_time').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['shipping_methods'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['shipping_methods'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['shipping_methods'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['shipping_methods'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['shipping_methods'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['shipping_methods'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/shipping_methods:
 *   get:
 *     summary: Retrieve a paginated list of shipping_methods
 *     description: Fetches a paginated list of shipping_methods from the database.
 *     tags: [Shipping_methods]
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
 *         description: A paginated list of shipping_methods
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
 *                       shipping_method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       cost:
 *                         type: number
 *                       estimated_delivery_time:
 *                         type: number
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
 * /api/v1/shipping_methods/all:
 *   get:
 *     summary: Retrieve all shipping_methods without pagination
 *     description: Fetches all shipping_methods from the database without pagination.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all shipping_methods
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
 *                       shipping_method_id:
 *                         type: number
 *                       method_name:
 *                         type: string
 *                       cost:
 *                         type: number
 *                       estimated_delivery_time:
 *                         type: number
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
 * /api/v1/shipping_methods/{id}:
 *   get:
 *     summary: Retrieve a single shipping_methods by ID
 *     description: Fetches a shipping_methods by its ID.
 *     tags: [Shipping_methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The shipping_methods ID
 *     responses:
 *       200:
 *         description: A single shipping_methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipping_method_id:
 *                       type: number
 *                     method_name:
 *                       type: string
 *                     cost:
 *                       type: number
 *                     estimated_delivery_time:
 *                       type: number
 *                     is_active:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Shipping_methods not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...shipping_methodsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...shipping_methodsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteshipping_methods);
export default router;
