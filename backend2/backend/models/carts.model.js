import db from '../common/db.js';
import logger from '../common/logger.js';

class Carts {
	constructor(carts) {
		this.cart_id = carts.cart_id;
		this.customer_id = carts.customer_id;
		this.created_at = carts.created_at;
		this.updated_at = carts.updated_at;
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
		const sql = 'SELECT * FROM carts LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM carts';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM carts';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM carts WHERE cart_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(carts) {
		const sql = 'INSERT INTO carts SET ?';
		const [result] = await this.query(sql, [carts]);
		return result;
	}

	static async update(id, carts) {
		const sql = 'UPDATE carts SET ? WHERE cart_id = ?';
		const [result] = await this.query(sql, [carts, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM carts WHERE cart_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Carts;
