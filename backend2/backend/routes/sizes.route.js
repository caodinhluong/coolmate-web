import express from 'express';
import { getAll, getById, insert, update, deletesizes } from '../controllers/sizes.controller.js';
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
const getByIdMiddleware = routeConfig['sizes'].getById === 'admin' ? [verifyAdmin] : [];
const insertMiddleware = routeConfig['sizes'].insert === 'admin' ? [verifyAdmin] : [];
const updateMiddleware = routeConfig['sizes'].update === 'admin' ? [verifyAdmin] : [];
const deleteMiddleware = routeConfig['sizes'].delete === 'admin' ? [verifyAdmin] : [];
/**
 * @swagger
 * /api/v1/sizes:
 *   get:
 *     summary: Retrieve a list of sizes
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
 *         description: A list of sizes
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

/**
 * @swagger
 * /api/v1/sizes:
 *   post:
 *     summary: Create a new sizes
 *     description: Creates a new sizes.
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - size_id
 *             properties:
 *               size_id:
 *                 type: number
 *                 description: The size_id of the sizes
 *               size_name:
 *                 type: string
 *                 description: The size_name of the sizes
 *               description:
 *                 type: string
 *                 description: The description of the sizes
 *               created_at:
 *                 type: string
 *                 description: The created_at of the sizes
 *     responses:
 *       201:
 *         description: Sizes created
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
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Sizes already exists
 *       500:
 *         description: Server error
 */
router.post('/', [...insertMiddleware, ...sizesValidation], validate, insert);

/**
 * @swagger
 * /api/v1/sizes/{id}:
 *   put:
 *     summary: Update a sizes by ID
 *     description: Updates an existing sizes.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - size_id
 *             properties:
 *               size_id:
 *                 type: number
 *                 description: The size_id of the sizes
 *               size_name:
 *                 type: string
 *                 description: The size_name of the sizes
 *               description:
 *                 type: string
 *                 description: The description of the sizes
 *               created_at:
 *                 type: string
 *                 description: The created_at of the sizes
 *     responses:
 *       200:
 *         description: Sizes updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *       400:
 *         description: Validation error or data empty
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Sizes not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [...updateMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer'), ...sizesValidation], validate, update);

/**
 * @swagger
 * /api/v1/sizes/{id}:
 *   delete:
 *     summary: Delete a sizes by ID
 *     description: Deletes a sizes by its ID.
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
 *         description: Sizes deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted successfully
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Sizes not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [...deleteMiddleware, param('id').notEmpty().withMessage('ID is required').isInt().withMessage('ID must be an integer')], validate, deletesizes);

export default router;
