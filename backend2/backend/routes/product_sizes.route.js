import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteproduct_sizes } from '../controllers/product_sizes.controller.js';
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
const product_sizesValidation = validationConfig['product_sizes'] || [
	body('product_size_id').optional(),
	body('product_id').optional(),
	body('size_id').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['product_sizes'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['product_sizes'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['product_sizes'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['product_sizes'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['product_sizes'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['product_sizes'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/product_sizes:
 *   get:
 *     summary: Retrieve a paginated list of product_sizes
 *     description: Fetches a paginated list of product_sizes from the database.
 *     tags: [Product_sizes]
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
 *         description: A paginated list of product_sizes
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
 *                       product_size_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       size_id:
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
 * /api/v1/product_sizes/all:
 *   get:
 *     summary: Retrieve all product_sizes without pagination
 *     description: Fetches all product_sizes from the database without pagination.
 *     tags: [Product_sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all product_sizes
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
 *                       product_size_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       size_id:
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
 * /api/v1/product_sizes/{id}:
 *   get:
 *     summary: Retrieve a single product_sizes by ID
 *     description: Fetches a product_sizes by its ID.
 *     tags: [Product_sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_sizes ID
 *     responses:
 *       200:
 *         description: A single product_sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_size_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     size_id:
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
 *         description: Product_sizes not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...product_sizesValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_sizesValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_sizes);
export default router;
