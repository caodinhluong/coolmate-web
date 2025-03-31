import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletecarts } from '../controllers/carts.controller.js';
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
const cartsValidation = validationConfig['carts'] || [
	body('cart_id').optional(),
	body('customer_id').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['carts'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['carts'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['carts'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['carts'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['carts'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['carts'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Retrieve a paginated list of carts
 *     description: Fetches a paginated list of carts from the database.
 *     tags: [Carts]
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
 *         description: A paginated list of carts
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
 *                       cart_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
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
 * /api/v1/carts/all:
 *   get:
 *     summary: Retrieve all carts without pagination
 *     description: Fetches all carts from the database without pagination.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all carts
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
 *                       cart_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
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
 * /api/v1/carts/{id}:
 *   get:
 *     summary: Retrieve a single carts by ID
 *     description: Fetches a carts by its ID.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The carts ID
 *     responses:
 *       200:
 *         description: A single carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Carts not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...cartsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...cartsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecarts);
export default router;
