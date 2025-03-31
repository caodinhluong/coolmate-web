import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteimport_invoices } from '../controllers/import_invoices.controller.js';
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
const import_invoicesValidation = validationConfig['import_invoices'] || [
	body('invoice_id').optional(),
	body('supplier_id').optional(),
	body('staff_id').optional(),
	body('total_amount').optional(),
	body('invoice_date').optional(),
	body('warehouse_id').optional(),
	body('created_at').optional(),
];
const getAllMiddleware = routeConfig['import_invoices'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['import_invoices'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['import_invoices'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['import_invoices'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['import_invoices'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['import_invoices'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/import_invoices:
 *   get:
 *     summary: Retrieve a paginated list of import_invoices
 *     description: Fetches a paginated list of import_invoices from the database.
 *     tags: [Import_invoices]
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
 *         description: A paginated list of import_invoices
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
 *                       invoice_id:
 *                         type: number
 *                       supplier_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       invoice_date:
 *                         type: string
 *                       warehouse_id:
 *                         type: number
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
 * /api/v1/import_invoices/all:
 *   get:
 *     summary: Retrieve all import_invoices without pagination
 *     description: Fetches all import_invoices from the database without pagination.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all import_invoices
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
 *                       invoice_id:
 *                         type: number
 *                       supplier_id:
 *                         type: number
 *                       staff_id:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       invoice_date:
 *                         type: string
 *                       warehouse_id:
 *                         type: number
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
 * /api/v1/import_invoices/{id}:
 *   get:
 *     summary: Retrieve a single import_invoices by ID
 *     description: Fetches a import_invoices by its ID.
 *     tags: [Import_invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoices ID
 *     responses:
 *       200:
 *         description: A single import_invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_id:
 *                       type: number
 *                     supplier_id:
 *                       type: number
 *                     staff_id:
 *                       type: number
 *                     total_amount:
 *                       type: number
 *                     invoice_date:
 *                       type: string
 *                     warehouse_id:
 *                       type: number
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Import_invoices not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...import_invoicesValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...import_invoicesValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteimport_invoices);
export default router;
