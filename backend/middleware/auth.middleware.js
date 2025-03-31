const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config'); 

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: 'Không có token, từ chối truy cập!' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ!' });
        
        req.user = user; 
        next();
    });
};
