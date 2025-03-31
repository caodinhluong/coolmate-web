import Product_promotions from '../models/product_promotions.model.js';
import logger from '../common/logger.js';

export const getAllProduct_promotions = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Product_promotions.getAll({ limit, offset });
		const [countResult] = await Product_promotions.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all product_promotions failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getAllProduct_promotionsWithoutPagination = async () => {
	try {
		const [data] = await Product_promotions.getAllWithoutPagination();
		return data;
	} catch (error) {
		logger.error(`Get all product_promotions without pagination failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getProduct_promotionsById = async (id) => {
	try {
		const [rows] = await Product_promotions.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get product_promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createProduct_promotions = async (product_promotions) => {
	try {
		if (!product_promotions || Object.keys(product_promotions).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Product_promotions.insert(product_promotions);
		return { id: result.insertId, ...product_promotions };
	} catch (error) {
		logger.error(`Create product_promotions failed: ${error.message}`, { data: product_promotions, stack: error.stack });
		throw error;
	}
};

export const updateProduct_promotions = async (id, product_promotions) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!product_promotions || Object.keys(product_promotions).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Product_promotions.update(id, product_promotions);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update product_promotions failed: ${error.message}`, { id, data: product_promotions, stack: error.stack });
		throw error;
	}
};

export const deleteProduct_promotions = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Product_promotions.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete product_promotions failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
