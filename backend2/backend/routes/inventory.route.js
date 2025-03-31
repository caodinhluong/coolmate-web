import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteinventory } from '../controllers/inventory.controller.js';
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
const inventoryValidation = validationConfig['inventory'] || [
	body('inventory_id').optional(),
	body('product_size_id').optional(),
	body('warehouse_id').optional(),
	body('stock').optional(),
	body('last_updated').optional(),
];
const getAllMiddleware = routeConfig['inventory'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['inventory'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['inventory'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['inventory'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['inventory'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['inventory'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Retrieve a paginated list of inventory
 *     description: Fetches a paginated list of inventory from the database.
 *     tags: [Inventory]
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
 *         description: A paginated list of inventory
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
 *                       inventory_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       warehouse_id:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       last_updated:
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
 * /api/v1/inventory/all:
 *   get:
 *     summary: Retrieve all inventory without pagination
 *     description: Fetches all inventory from the database without pagination.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all inventory
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
 *                       inventory_id:
 *                         type: number
 *                       product_size_id:
 *                         type: number
 *                       warehouse_id:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       last_updated:
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
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Retrieve a single inventory by ID
 *     description: Fetches a inventory by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory ID
 *     responses:
 *       200:
 *         description: A single inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     inventory_id:
 *                       type: number
 *                     product_size_id:
 *                       type: number
 *                     warehouse_id:
 *                       type: number
 *                     stock:
 *                       type: number
 *                     last_updated:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...inventoryValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...inventoryValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteinventory);
export default router;
