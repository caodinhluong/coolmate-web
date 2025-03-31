import db from '../common/db.js';
import logger from '../common/logger.js';

class Sizes {
	constructor(sizes) {
		this.size_id = sizes.size_id;
		this.size_name = sizes.size_name;
		this.description = sizes.description;
		this.created_at = sizes.created_at;
	}

	static async query(sql, params) {
		try {{
			return await db.query(sql, params);
		}} catch (error) {
			logger.error(`Database query error: ${error.message}`, { sql, params, stack: error.stack });
			throw new Error(`Database error: ${error.message}`);
		}
	}

	static async getAll({ limit = 10, offset = 0 } = {}) {
		const sql = 'SELECT * FROM sizes LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM sizes';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM sizes WHERE size_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(sizes) {
		const sql = 'INSERT INTO sizes SET ?';
		return await this.query(sql, sizes);
	}

	static async update(id, sizes) {
		const sql = 'UPDATE sizes SET ? WHERE size_id = ?';
		return await this.query(sql, [sizes, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM sizes WHERE size_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Sizes;
