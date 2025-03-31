import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletecustomers } from '../controllers/customers.controller.js';
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
const customersValidation = validationConfig['customers'] || [
	body('customer_id').optional(),
	body('username').optional(),
	body('email').optional(),
	body('password_hash').optional(),
	body('full_name').optional(),
	body('birth_date').optional(),
	body('gender').optional(),
	body('phone').optional(),
	body('address').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['customers'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['customers'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['customers'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['customers'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['customers'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['customers'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Retrieve a paginated list of customers
 *     description: Fetches a paginated list of customers from the database.
 *     tags: [Customers]
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
 *         description: A paginated list of customers
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
 *                       customer_id:
 *                         type: number
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       password_hash:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
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
 * /api/v1/customers/all:
 *   get:
 *     summary: Retrieve all customers without pagination
 *     description: Fetches all customers from the database without pagination.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all customers
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
 *                       customer_id:
 *                         type: number
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       password_hash:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
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
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Retrieve a single customers by ID
 *     description: Fetches a customers by its ID.
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customers ID
 *     responses:
 *       200:
 *         description: A single customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: number
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password_hash:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     birth_date:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
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
 *         description: Customers not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...customersValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...customersValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletecustomers);
export default router;
