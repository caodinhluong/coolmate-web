import db from '../common/db.js';
import logger from '../common/logger.js';

class Transactions {
	constructor(transactions) {
		this.transaction_id = transactions.transaction_id;
		this.order_id = transactions.order_id;
		this.method_id = transactions.method_id;
		this.amount = transactions.amount;
		this.transaction_status = transactions.transaction_status;
		this.transaction_date = transactions.transaction_date;
		this.transaction_code = transactions.transaction_code;
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
		const sql = 'SELECT * FROM transactions LIMIT ? OFFSET ?';
		const [result] = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getAllWithoutPagination() {
		const sql = 'SELECT * FROM transactions';
		const [result] = await this.query(sql);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM transactions';
		const [result] = await this.query(sql);
		return result[0].total;
	}

	static async getById(id) {
		const sql = 'SELECT * FROM transactions WHERE transaction_id = ?';
		const [result] = await this.query(sql, [id]);
		return result.length > 0 ? result[0] : null;
	}

	static async insert(transactions) {
		const sql = 'INSERT INTO transactions SET ?';
		const [result] = await this.query(sql, [transactions]);
		return result;
	}

	static async update(id, transactions) {
		const sql = 'UPDATE transactions SET ? WHERE transaction_id = ?';
		const [result] = await this.query(sql, [transactions, id]);
		return result;
	}

	static async delete(id) {
		const sql = 'DELETE FROM transactions WHERE transaction_id = ?';
		const [result] = await this.query(sql, [id]);
		return result;
	}
}

export default Transactions;
