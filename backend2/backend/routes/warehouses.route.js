import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletewarehouses } from '../controllers/warehouses.controller.js';
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
const warehousesValidation = validationConfig['warehouses'] || [
	body('warehouse_id').optional(),
	body('warehouse_name').optional(),
	body('location').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['warehouses'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['warehouses'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['warehouses'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['warehouses'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['warehouses'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['warehouses'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/warehouses:
 *   get:
 *     summary: Retrieve a paginated list of warehouses
 *     description: Fetches a paginated list of warehouses from the database.
 *     tags: [Warehouses]
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
 *         description: A paginated list of warehouses
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
 *                       warehouse_id:
 *                         type: number
 *                       warehouse_name:
 *                         type: string
 *                       location:
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
 * /api/v1/warehouses/all:
 *   get:
 *     summary: Retrieve all warehouses without pagination
 *     description: Fetches all warehouses from the database without pagination.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all warehouses
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
 *                       warehouse_id:
 *                         type: number
 *                       warehouse_name:
 *                         type: string
 *                       location:
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
 * /api/v1/warehouses/{id}:
 *   get:
 *     summary: Retrieve a single warehouses by ID
 *     description: Fetches a warehouses by its ID.
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouses ID
 *     responses:
 *       200:
 *         description: A single warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     warehouse_id:
 *                       type: number
 *                     warehouse_name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Warehouses not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...warehousesValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...warehousesValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletewarehouses);
export default router;
