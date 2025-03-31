import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletesizes } from '../controllers/sizes.controller.js';
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
const sizesValidation = validationConfig['sizes'] || [
	body('size_id').optional(),
	body('size_name').optional(),
	body('description').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['sizes'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['sizes'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['sizes'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['sizes'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['sizes'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['sizes'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/sizes:
 *   get:
 *     summary: Retrieve a paginated list of sizes
 *     description: Fetches a paginated list of sizes from the database.
 *     tags: [Sizes]
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
 *         description: A paginated list of sizes
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
 *                       size_id:
 *                         type: number
 *                       size_name:
 *                         type: string
 *                       description:
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
 * /api/v1/sizes/all:
 *   get:
 *     summary: Retrieve all sizes without pagination
 *     description: Fetches all sizes from the database without pagination.
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all sizes
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
 *                       size_id:
 *                         type: number
 *                       size_name:
 *                         type: string
 *                       description:
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
 * /api/v1/sizes/{id}:
 *   get:
 *     summary: Retrieve a single sizes by ID
 *     description: Fetches a sizes by its ID.
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sizes ID
 *     responses:
 *       200:
 *         description: A single sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     size_id:
 *                       type: number
 *                     size_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Sizes not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...sizesValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...sizesValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletesizes);
export default router;
