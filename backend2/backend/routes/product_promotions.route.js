import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteproduct_promotions } from '../controllers/product_promotions.controller.js';
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
const getAllWithoutPaginationMiddleware = routeConfig['product_promotions'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['product_promotions'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['product_promotions'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['product_promotions'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['product_promotions'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/product_promotions:
 *   get:
 *     summary: Retrieve a paginated list of product_promotions
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
 *         description: A paginated list of product_promotions
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
 * /api/v1/product_promotions/all:
 *   get:
 *     summary: Retrieve all product_promotions without pagination
 *     description: Fetches all product_promotions from the database without pagination.
 *     tags: [Product_promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all product_promotions
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

router.post('/', [...insertMiddleware, ...product_promotionsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...product_promotionsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteproduct_promotions);
export default router;
