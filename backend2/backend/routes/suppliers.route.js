import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deletesuppliers } from '../controllers/suppliers.controller.js';
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
const suppliersValidation = validationConfig['suppliers'] || [
	body('supplier_id').optional(),
	body('supplier_name').optional(),
	body('contact_name').optional(),
	body('phone').optional(),
	body('email').optional(),
	body('address').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['suppliers'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['suppliers'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['suppliers'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['suppliers'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['suppliers'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['suppliers'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Retrieve a paginated list of suppliers
 *     description: Fetches a paginated list of suppliers from the database.
 *     tags: [Suppliers]
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
 *         description: A paginated list of suppliers
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
 *                       supplier_id:
 *                         type: number
 *                       supplier_name:
 *                         type: string
 *                       contact_name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       address:
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
 * /api/v1/suppliers/all:
 *   get:
 *     summary: Retrieve all suppliers without pagination
 *     description: Fetches all suppliers from the database without pagination.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all suppliers
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
 *                       supplier_id:
 *                         type: number
 *                       supplier_name:
 *                         type: string
 *                       contact_name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       address:
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
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Retrieve a single suppliers by ID
 *     description: Fetches a suppliers by its ID.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The suppliers ID
 *     responses:
 *       200:
 *         description: A single suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     supplier_id:
 *                       type: number
 *                     supplier_name:
 *                       type: string
 *                     contact_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Suppliers not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...suppliersValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...suppliersValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletesuppliers);
export default router;
