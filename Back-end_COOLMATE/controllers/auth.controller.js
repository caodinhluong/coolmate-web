const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { SECRET_KEY } = require('../config/config'); // Chứa SECRET_KEY

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findUserByUsername(username);
        if (!user || !user.checkPassword(password)) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role ,name:user.name}, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
exports.protectedRoute = (req, res) => {
    res.json({ message: `Chào ${req.user.name} TOKEN CHUẨN ĐẤY` });
};
