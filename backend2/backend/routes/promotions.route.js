import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletepromotions } from '../controllers/promotions.controller.js';
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
const promotionsValidation = validationConfig['promotions'] || [
	body('promotion_id').optional(),
	body('promotion_code').optional(),
	body('description').optional(),
	body('discount_type').optional(),
	body('discount_value').optional(),
	body('min_order_value').optional(),
	body('start_date').optional(),
	body('end_date').optional(),
	body('is_active').optional(),
	body('created_at').optional(),
	body('updated_at').optional(),
];
const getAllMiddleware = routeConfig['promotions'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['promotions'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['promotions'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['promotions'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['promotions'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['promotions'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/promotions:
 *   get:
 *     summary: Retrieve a paginated list of promotions
 *     description: Fetches a paginated list of promotions from the database.
 *     tags: [Promotions]
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
 *         description: A paginated list of promotions
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
 *                       promotion_id:
 *                         type: number
 *                       promotion_code:
 *                         type: string
 *                       description:
 *                         type: string
 *                       discount_type:
 *                         type: string
 *                       discount_value:
 *                         type: number
 *                       min_order_value:
 *                         type: number
 *                       start_date:
 *                         type: string
 *                       end_date:
 *                         type: string
 *                       is_active:
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
 * /api/v1/promotions/all:
 *   get:
 *     summary: Retrieve all promotions without pagination
 *     description: Fetches all promotions from the database without pagination.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all promotions
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
 *                       promotion_id:
 *                         type: number
 *                       promotion_code:
 *                         type: string
 *                       description:
 *                         type: string
 *                       discount_type:
 *                         type: string
 *                       discount_value:
 *                         type: number
 *                       min_order_value:
 *                         type: number
 *                       start_date:
 *                         type: string
 *                       end_date:
 *                         type: string
 *                       is_active:
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
 * /api/v1/promotions/{id}:
 *   get:
 *     summary: Retrieve a single promotions by ID
 *     description: Fetches a promotions by its ID.
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The promotions ID
 *     responses:
 *       200:
 *         description: A single promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     promotion_id:
 *                       type: number
 *                     promotion_code:
 *                       type: string
 *                     description:
 *                       type: string
 *                     discount_type:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     min_order_value:
 *                       type: number
 *                     start_date:
 *                       type: string
 *                     end_date:
 *                       type: string
 *                     is_active:
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
 *         description: Promotions not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...promotionsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...promotionsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletepromotions);
export default router;
