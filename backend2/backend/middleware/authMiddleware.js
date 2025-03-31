import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../common/db.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import logger from '../common/logger.js';

const SECRET_KEY = process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is required'); })();
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || (() => { throw new Error('JWT_REFRESH_SECRET is required'); })();
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET_KEY
}, async (jwtPayload, done) => {
	try {
		const [users] = await db.query('SELECT * FROM users WHERE account_id = ?', [jwtPayload.id]);
		if (users.length > 0) return done(null, users[0]);
		return done(null, false);
	} catch (error) {
		logger.error(`JWT verify error: ${error.message}`, { stack: error.stack });
		return done(error);
	}
}));
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
export const register = [
	body('email').isEmail().withMessage('Invalid email'),
	body('username').notEmpty().withMessage('Username is required'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	body('role').isIn(['admin', 'staff']).withMessage('Role must be admin or staff'),
	validate,
	async (req, res) => {
		const { email, username, password, role } = req.body;
		try {
			const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
			if (existingUsers.length > 0) {
				logger.warn(`Registration attempt with existing email or username: ${email}, ${username}`);
				return res.status(409).json({ message: 'Email or username already exists' });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const [result] = await db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
			logger.info(`User registered successfully: ${username}, ${email}`);
			res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
		} catch (error) {
			logger.error(`Registration error: ${error.message}`, { email, username, stack: error.stack });
			if (error.code === 'ER_ACCESS_DENIED_ERROR') {
				return res.status(500).json({ message: 'Database connection failed' });
			} else if (error.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'Email or username already persists' });
			}
			res.status(500).json({ message: `Registration error: ${error.message}` });
		}
	}
];
export const login = [
	body('email').isEmail().withMessage('Invalid email'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	validate,
	async (req, res) => {
		const { email, password } = req.body;
		try {
			const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
			if (users.length === 0) {
				logger.warn(`Login failed: Invalid email ${email}`);
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			const user = users[0];
			const isMatch = await bcrypt.compare(password, user.password_hash);
			if (!isMatch) {
				logger.warn(`Login failed: Invalid password for ${email}`);
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			const accessToken = jwt.sign({ id: user.account_id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
			logger.info(`User logged in successfully: ${email}`);
			res.status(200).json({ accessToken, user: { id: user.account_id, email: user.email, role: user.role } });
		} catch (error) {
			logger.error(`Login error: ${error.message}`, { email, stack: error.stack });
			if (error.code === 'ER_ACCESS_DENIED_ERROR') {
				return res.status(500).json({ message: 'Database connection failed' });
			} else if (error.name === 'SyntaxError') {
				return res.status(400).json({ message: 'Invalid data format' });
			}
			res.status(500).json({ message: `Login error: ${error.message}` });
		}
	}
];
export const refreshToken = async (req, res) => {
	return res.status(400).json({ message: 'Refresh token functionality is not supported' });
};
export const logout = async (req, res) => {
	try {
		logger.info(`User logged out successfully`);
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		logger.error(`Logout error: ${error.message}`, { stack: error.stack });
		res.status(500).json({ message: `Logout error: ${error.message}` });
	}
};
export const verifyAdmin = [
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (req.user.role !== 'admin') {
			logger.warn(`Unauthorized admin access attempt by: ${req.user.email}`);
			return res.status(403).json({ message: 'Admin privileges required' });
		}
		next();
	}
];
