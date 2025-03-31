import { getAllSizes, getSizesById, createSizes, updateSizes, deleteSizes } from '../services/sizes.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllSizes({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all sizes failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table sizes does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching sizes: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getSizesById(id);
		if (!data) return res.status(404).json({ message: `sizes not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get sizes by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching sizes: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const sizes = req.body;
	try {
		const data = await createSizes(sizes);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert sizes failed: ${error.message}`, { data: sizes, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `sizes already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting sizes: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const sizes = req.body;
	try {
		const success = await updateSizes(id, sizes);
		if (!success) return res.status(404).json({ message: `sizes not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update sizes failed: ${error.message}`, { id, data: sizes, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating sizes: ${error.message}` });
		}
	}
};

export const deletesizes = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteSizes(id);
		if (!success) return res.status(404).json({ message: `sizes not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete sizes failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting sizes: ${error.message}` });
		}
	}
};
