import Sizes from '../models/sizes.model.js';
import logger from '../common/logger.js';

export const getAllSizes = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Sizes.getAll({ limit, offset });
		const [countResult] = await Sizes.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all sizes failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getAllSizesWithoutPagination = async () => {
	try {
		const [data] = await Sizes.getAllWithoutPagination();
		return data;
	} catch (error) {
		logger.error(`Get all sizes without pagination failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getSizesById = async (id) => {
	try {
		const [rows] = await Sizes.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get sizes by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createSizes = async (sizes) => {
	try {
		if (!sizes || Object.keys(sizes).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Sizes.insert(sizes);
		return { id: result.insertId, ...sizes };
	} catch (error) {
		logger.error(`Create sizes failed: ${error.message}`, { data: sizes, stack: error.stack });
		throw error;
	}
};

export const updateSizes = async (id, sizes) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!sizes || Object.keys(sizes).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Sizes.update(id, sizes);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update sizes failed: ${error.message}`, { id, data: sizes, stack: error.stack });
		throw error;
	}
};

export const deleteSizes = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Sizes.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete sizes failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
