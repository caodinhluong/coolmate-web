import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletebrands } from '../controllers/brands.controller.js';
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
const brandsValidation = validationConfig['brands'] || [
	body('brand_id').optional(),
	body('brand_name').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['brands'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['brands'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['brands'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['brands'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['brands'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['brands'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Retrieve a paginated list of brands
 *     description: Fetches a paginated list of brands from the database.
 *     tags: [Brands]
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
 *         description: A paginated list of brands
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
 *                       brand_id:
 *                         type: number
 *                       brand_name:
 *                         type: string
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
 * /api/v1/brands/all:
 *   get:
 *     summary: Retrieve all brands without pagination
 *     description: Fetches all brands from the database without pagination.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all brands
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
 *                       brand_id:
 *                         type: number
 *                       brand_name:
 *                         type: string
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
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Retrieve a single brands by ID
 *     description: Fetches a brands by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brands ID
 *     responses:
 *       200:
 *         description: A single brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     brand_id:
 *                       type: number
 *                     brand_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Brands not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...brandsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...brandsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletebrands);
export default router;
