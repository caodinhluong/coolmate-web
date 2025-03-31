import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletereviews } from '../controllers/reviews.controller.js';
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
const reviewsValidation = validationConfig['reviews'] || [
	body('review_id').optional(),
	body('customer_id').optional(),
	body('product_id').optional(),
	body('rating').optional(),
	body('comment').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['reviews'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['reviews'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['reviews'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['reviews'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['reviews'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['reviews'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Retrieve a paginated list of reviews
 *     description: Fetches a paginated list of reviews from the database.
 *     tags: [Reviews]
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
 *         description: A paginated list of reviews
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
 *                       review_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       comment:
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
 * /api/v1/reviews/all:
 *   get:
 *     summary: Retrieve all reviews without pagination
 *     description: Fetches all reviews from the database without pagination.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all reviews
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
 *                       review_id:
 *                         type: number
 *                       customer_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       comment:
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
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Retrieve a single reviews by ID
 *     description: Fetches a reviews by its ID.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reviews ID
 *     responses:
 *       200:
 *         description: A single reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_id:
 *                       type: number
 *                     customer_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     rating:
 *                       type: number
 *                     comment:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Reviews not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...reviewsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...reviewsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletereviews);
export default router;
