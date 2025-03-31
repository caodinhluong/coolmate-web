import { getAllProduct_sizes, getProduct_sizesById, createProduct_sizes, updateProduct_sizes, deleteProduct_sizes } from '../services/product_sizes.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllProduct_sizes({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all product_sizes failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table product_sizes does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching product_sizes: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getProduct_sizesById(id);
		if (!data) return res.status(404).json({ message: `product_sizes not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get product_sizes by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching product_sizes: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const product_sizes = req.body;
	try {
		const data = await createProduct_sizes(product_sizes);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert product_sizes failed: ${error.message}`, { data: product_sizes, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `product_sizes already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting product_sizes: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const product_sizes = req.body;
	try {
		const success = await updateProduct_sizes(id, product_sizes);
		if (!success) return res.status(404).json({ message: `product_sizes not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update product_sizes failed: ${error.message}`, { id, data: product_sizes, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating product_sizes: ${error.message}` });
		}
	}
};

export const deleteproduct_sizes = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteProduct_sizes(id);
		if (!success) return res.status(404).json({ message: `product_sizes not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete product_sizes failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting product_sizes: ${error.message}` });
		}
	}
};
