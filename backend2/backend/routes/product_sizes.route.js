import express from 'express';
import { getAll, getById, insert, update, deleteproduct_sizes } from '../controllers/product_sizes.controller.js';
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
const getByIdMiddleware = routeConfig['product_sizes'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['product_sizes'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['product_sizes'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['product_sizes'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/product_sizes:
 *   get:
 *     summary: Retrieve a list of product_sizes
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
 *         description: A list of product_sizes
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

/**
 * @swagger
 * /api/v1/product_sizes:
 *   post:
 *     summary: Create a new product_sizes
 *     description: Creates a new product_sizes.
 *     tags: [Product_sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_size_id
 *             properties:
 *               product_size_id:
 *                 type: number
 *                 description: The product_size_id of the product_sizes
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_sizes
 *               size_id:
 *                 type: number
 *                 description: The size_id of the product_sizes
 *               created_at:
 *                 type: string
 *                 description: The created_at of the product_sizes
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the product_sizes
 *     responses:
 *       201:
 *         description: Product_sizes created
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
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Product_sizes already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...product_sizesValidation], validate, insert);

/**
 * @swagger
 * /api/v1/product_sizes/{id}:
 *   put:
 *     summary: Update a product_sizes by ID
 *     description: Updates an existing product_sizes.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_size_id
 *             properties:
 *               product_size_id:
 *                 type: number
 *                 description: The product_size_id of the product_sizes
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_sizes
 *               size_id:
 *                 type: number
 *                 description: The size_id of the product_sizes
 *               created_at:
 *                 type: string
 *                 description: The created_at of the product_sizes
 *               updated_at:
 *                 type: string
 *                 description: The updated_at of the product_sizes
 *     responses:
 *       200:
 *         description: Product_sizes updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product_sizes not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_sizesValidation], validate, update);

/**
 * @swagger
 * /api/v1/product_sizes/{id}:
 *   delete:
 *     summary: Delete a product_sizes by ID
 *     description: Deletes a product_sizes by its ID.
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
 *         description: Product_sizes deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted successfully
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product_sizes not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_sizes);

export default router;
