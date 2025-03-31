import express from 'express';
import { getAll, getById, insert, update, deleteproduct_promotions } from '../controllers/product_promotions.controller.js';
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
const product_promotionsValidation = validationConfig['product_promotions'] || [
	body('product_promotion_id').optional(),
	body('product_id').optional(),
	body('promotion_id').optional(),
	body('applied_discount').optional(),
];
const getAllMiddleware = routeConfig['product_promotions'].getAll === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['product_promotions'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['product_promotions'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['product_promotions'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['product_promotions'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/product_promotions:
 *   get:
 *     summary: Retrieve a list of product_promotions
 *     description: Fetches a paginated list of product_promotions from the database.
 *     tags: [Product_promotions]
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
 *         description: A list of product_promotions
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
 *                       product_promotion_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       promotion_id:
 *                         type: number
 *                       applied_discount:
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
 * /api/v1/product_promotions/{id}:
 *   get:
 *     summary: Retrieve a single product_promotions by ID
 *     description: Fetches a product_promotions by its ID.
 *     tags: [Product_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_promotions ID
 *     responses:
 *       200:
 *         description: A single product_promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_promotion_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     promotion_id:
 *                       type: number
 *                     applied_discount:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product_promotions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

/**
 * @swagger
 * /api/v1/product_promotions:
 *   post:
 *     summary: Create a new product_promotions
 *     description: Creates a new product_promotions.
 *     tags: [Product_promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_promotion_id
 *             properties:
 *               product_promotion_id:
 *                 type: number
 *                 description: The product_promotion_id of the product_promotions
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_promotions
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the product_promotions
 *               applied_discount:
 *                 type: number
 *                 description: The applied_discount of the product_promotions
 *     responses:
 *       201:
 *         description: Product_promotions created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_promotion_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     promotion_id:
 *                       type: number
 *                     applied_discount:
 *                       type: number
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Product_promotions already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...product_promotionsValidation], validate, insert);

/**
 * @swagger
 * /api/v1/product_promotions/{id}:
 *   put:
 *     summary: Update a product_promotions by ID
 *     description: Updates an existing product_promotions.
 *     tags: [Product_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_promotions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_promotion_id
 *             properties:
 *               product_promotion_id:
 *                 type: number
 *                 description: The product_promotion_id of the product_promotions
 *               product_id:
 *                 type: number
 *                 description: The product_id of the product_promotions
 *               promotion_id:
 *                 type: number
 *                 description: The promotion_id of the product_promotions
 *               applied_discount:
 *                 type: number
 *                 description: The applied_discount of the product_promotions
 *     responses:
 *       200:
 *         description: Product_promotions updated
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
 *         description: Product_promotions not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_promotionsValidation], validate, update);

/**
 * @swagger
 * /api/v1/product_promotions/{id}:
 *   delete:
 *     summary: Delete a product_promotions by ID
 *     description: Deletes a product_promotions by its ID.
 *     tags: [Product_promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product_promotions ID
 *     responses:
 *       200:
 *         description: Product_promotions deleted
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
 *         description: Product_promotions not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_promotions);

export default router;
