import db from '../common/db.js';
import logger from '../common/logger.js';

class Product_promotions {
	constructor(product_promotions) {
		this.product_promotion_id = product_promotions.product_promotion_id;
		this.product_id = product_promotions.product_id;
		this.promotion_id = product_promotions.promotion_id;
		this.applied_discount = product_promotions.applied_discount;
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
		const sql = 'SELECT * FROM product_promotions LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM product_promotions';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM product_promotions';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM product_promotions WHERE product_promotion_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(product_promotions) {
		const sql = 'INSERT INTO product_promotions SET ?';
		const [result] = await this.query(sql, [product_promotions]);
		return result;
	}

	static async update(id, product_promotions) {
		const sql = 'UPDATE product_promotions SET ? WHERE product_promotion_id = ?';
		const [result] = await this.query(sql, [product_promotions, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM product_promotions WHERE product_promotion_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Product_promotions;
