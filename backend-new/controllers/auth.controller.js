// controllers/auth.controller.js - Phiên bản KHÔNG MÃ HÓA MẬT KHẨU

const User = require('../models/users.model.js');
// const bcrypt = require('bcryptjs'); // Không cần bcrypt nữa
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email và mật khẩu không được để trống!" });
    }

    User.findByEmail(email, (err, user) => {
        // Xử lý lỗi từ database
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({ message: "Email hoặc mật khẩu không chính xác." });
            }
            console.error("Lỗi server khi tìm người dùng:", err);
            return res.status(500).send({ message: "Đã xảy ra lỗi server." });
        }
        
        // `user` là đối tượng người dùng lấy từ database
        if (!user) {
             return res.status(404).send({ message: "Email hoặc mật khẩu không chính xác." });
        }

        // ===== THAY ĐỔI CHÍNH: SO SÁNH MẬT KHẨU TRỰC TIẾP =====
        // So sánh mật khẩu người dùng gửi lên (`password`) 
        // với mật khẩu lưu trong DB (`user.password`).
        // Hãy chắc chắn rằng `user.password` là tên cột đúng.
        const passwordIsValid = (password === user.password);

        console.log("--- DEBUG ĐĂNG NHẬP (KHÔNG MÃ HÓA) ---");
        console.log("Mật khẩu từ request:", `'${password}'`);
        console.log("Mật khẩu từ database:", `'${user.password}'`);
        console.log("Kết quả so sánh:", passwordIsValid);
        console.log("--- KẾT THÚC DEBUG ---");
        // =========================================================

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Email hoặc mật khẩu không chính xác."
            });
        }

        // Tạo token (giữ nguyên)
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 giờ
        });

        // Trả về kết quả thành công
        res.status(200).send({
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url,
            },
            accessToken: token
        });
    });
};