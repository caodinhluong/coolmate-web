import db from '../common/db.js';
import logger from '../common/logger.js';

class Shipping_methods {
	constructor(shipping_methods) {
		this.shipping_method_id = shipping_methods.shipping_method_id;
		this.method_name = shipping_methods.method_name;
		this.cost = shipping_methods.cost;
		this.estimated_delivery_time = shipping_methods.estimated_delivery_time;
		this.is_active = shipping_methods.is_active;
		this.created_at = shipping_methods.created_at;
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
		const sql = 'SELECT * FROM shipping_methods LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM shipping_methods';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM shipping_methods';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM shipping_methods WHERE shipping_method_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(shipping_methods) {
		const sql = 'INSERT INTO shipping_methods SET ?';
		const [result] = await this.query(sql, [shipping_methods]);
		return result;
	}

	static async update(id, shipping_methods) {
		const sql = 'UPDATE shipping_methods SET ? WHERE shipping_method_id = ?';
		const [result] = await this.query(sql, [shipping_methods, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM shipping_methods WHERE shipping_method_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Shipping_methods;
