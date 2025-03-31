import express from 'express';
import { getAll, getAllWithoutPagination, getById, insert, update, deleteimport_invoice_details } from '../controllers/import_invoice_details.controller.js';
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
const import_invoice_detailsValidation = validationConfig['import_invoice_details'] || [
	body('detail_id').optional(),
	body('invoice_id').optional(),
	body('product_id').optional(),
	body('quantity').optional(),
	body('price').optional(),
];
const getAllMiddleware = routeConfig['import_invoice_details'].getAll === 'admin' ? [verifyAdmin] : [];
const getAllWithoutPaginationMiddleware = routeConfig['import_invoice_details'].getAllWithoutPagination === 'admin' ? [verifyAdmin] : [];
const getByIdMiddleware = routeConfig['import_invoice_details'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['import_invoice_details'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['import_invoice_details'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['import_invoice_details'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/import_invoice_details:
 *   get:
 *     summary: Retrieve a paginated list of import_invoice_details
 *     description: Fetches a paginated list of import_invoice_details from the database.
 *     tags: [Import_invoice_details]
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
 *         description: A paginated list of import_invoice_details
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
 *                       detail_id:
 *                         type: number
 *                       invoice_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
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
 * /api/v1/import_invoice_details/all:
 *   get:
 *     summary: Retrieve all import_invoice_details without pagination
 *     description: Fetches all import_invoice_details from the database without pagination.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all import_invoice_details
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
 *                       detail_id:
 *                         type: number
 *                       invoice_id:
 *                         type: number
 *                       product_id:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       price:
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
 * /api/v1/import_invoice_details/{id}:
 *   get:
 *     summary: Retrieve a single import_invoice_details by ID
 *     description: Fetches a import_invoice_details by its ID.
 *     tags: [Import_invoice_details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The import_invoice_details ID
 *     responses:
 *       200:
 *         description: A single import_invoice_details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     detail_id:
 *                       type: number
 *                     invoice_id:
 *                       type: number
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Import_invoice_details not found
 *       500:
 *         description: Server error
 */
router.get('/:id', [...getByIdMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, getById);

router.post('/', [...insertMiddleware, ...import_invoice_detailsValidation], validate, insert);
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...import_invoice_detailsValidation], validate, update);
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deleteimport_invoice_details);
export default router;
