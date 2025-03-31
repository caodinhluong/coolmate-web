import Product_sizes from '../models/product_sizes.model.js';
import logger from '../common/logger.js';

export const getAllProduct_sizes = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Product_sizes.getAll({ limit, offset });
		const [countResult] = await Product_sizes.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all product_sizes failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getAllProduct_sizesWithoutPagination = async () => {
	try {
		const [data] = await Product_sizes.getAllWithoutPagination();
		return data;
	} catch (error) {
		logger.error(`Get all product_sizes without pagination failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getProduct_sizesById = async (id) => {
	try {
		const [rows] = await Product_sizes.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get product_sizes by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createProduct_sizes = async (product_sizes) => {
	try {
		if (!product_sizes || Object.keys(product_sizes).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Product_sizes.insert(product_sizes);
		return { id: result.insertId, ...product_sizes };
	} catch (error) {
		logger.error(`Create product_sizes failed: ${error.message}`, { data: product_sizes, stack: error.stack });
		throw error;
	}
};

export const updateProduct_sizes = async (id, product_sizes) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!product_sizes || Object.keys(product_sizes).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Product_sizes.update(id, product_sizes);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update product_sizes failed: ${error.message}`, { id, data: product_sizes, stack: error.stack });
		throw error;
	}
};

export const deleteProduct_sizes = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Product_sizes.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete product_sizes failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
