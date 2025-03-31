import db from '../common/db.js';
import logger from '../common/logger.js';

class Reviews {
	constructor(reviews) {
		this.review_id = reviews.review_id;
		this.customer_id = reviews.customer_id;
		this.product_id = reviews.product_id;
		this.rating = reviews.rating;
		this.comment = reviews.comment;
		this.created_at = reviews.created_at;
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
		const sql = 'SELECT * FROM reviews LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM reviews';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM reviews';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM reviews WHERE review_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(reviews) {
		const sql = 'INSERT INTO reviews SET ?';
		const [result] = await this.query(sql, [reviews]);
		return result;
	}

	static async update(id, reviews) {
		const sql = 'UPDATE reviews SET ? WHERE review_id = ?';
		const [result] = await this.query(sql, [reviews, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM reviews WHERE review_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Reviews;
