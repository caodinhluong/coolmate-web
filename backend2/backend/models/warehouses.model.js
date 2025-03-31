import db from '../common/db.js';
import logger from '../common/logger.js';

class Warehouses {
	constructor(warehouses) {
		this.warehouse_id = warehouses.warehouse_id;
		this.warehouse_name = warehouses.warehouse_name;
		this.location = warehouses.location;
		this.created_at = warehouses.created_at;
	}

	static async query(sql, params) {
		try {
			return await db.query(sql, params);
		} catch (error) {
			logger.error(`Database query error: ${error.message}`, { sql, params, stack: error.stack });
			throw new Error(`Database error: ${error.message}`);
		}
	}

	static async getAll({ limit = 10, offset = 0 } = {}) {
		const sql = 'SELECT * FROM warehouses LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM warehouses';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM warehouses';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM warehouses WHERE warehouse_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(warehouses) {
		const sql = 'INSERT INTO warehouses SET ?';
		const [result] = await this.query(sql, [warehouses]);
		return result;
	}

	static async update(id, warehouses) {
		const sql = 'UPDATE warehouses SET ? WHERE warehouse_id = ?';
		const [result] = await this.query(sql, [warehouses, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM warehouses WHERE warehouse_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Warehouses;
