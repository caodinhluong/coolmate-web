import { getAllProduct_promotions, getAllProduct_promotionsWithoutPagination, getProduct_promotionsById, createProduct_promotions, updateProduct_promotions, deleteProduct_promotions } from '../services/product_promotions.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllProduct_promotions({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all product_promotions failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table product_promotions does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching product_promotions: ${error.message}` });
		}
	}
};

export const getAllWithoutPagination = async (req, res) => {
	try {
		const data = await getAllProduct_promotionsWithoutPagination();
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get all product_promotions without pagination failed: ${error.message}`, { stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table product_promotions does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching product_promotions: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getProduct_promotionsById(id);
		if (!data) return res.status(404).json({ message: `product_promotions not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get product_promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching product_promotions: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const product_promotions = req.body;
	try {
		const data = await createProduct_promotions(product_promotions);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert product_promotions failed: ${error.message}`, { data: product_promotions, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `product_promotions already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting product_promotions: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const product_promotions = req.body;
	try {
		const success = await updateProduct_promotions(id, product_promotions);
		if (!success) return res.status(404).json({ message: `product_promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update product_promotions failed: ${error.message}`, { id, data: product_promotions, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating product_promotions: ${error.message}` });
		}
	}
};

export const deleteproduct_promotions = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteProduct_promotions(id);
		if (!success) return res.status(404).json({ message: `product_promotions not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete product_promotions failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting product_promotions: ${error.message}` });
		}
	}
};
