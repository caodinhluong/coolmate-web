// controllers/auth.controller.js - Phiên bản sửa lỗi ASYNC

const User = require('../models/users.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Sử dụng async cho hàm login để có thể dùng await
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email và mật khẩu không được để trống!" });
    }

    // Dùng try...catch để xử lý lỗi từ các hàm bất đồng bộ
    try {
        // Lấy user từ DB - Giả sử User.findByEmail được viết lại để trả về Promise
        // Nếu không, bạn cần bọc nó trong Promise
        const user = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });

        if (!user) {
             return res.status(404).send({ message: "Email hoặc mật khẩu không chính xác." });
        }

        // *** SỬA LỖI CHÍNH ***
        // Sử dụng await với bcrypt.compare
        const passwordIsValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        console.log("--- BCRYPT DEBUG ---");
        console.log("Mật khẩu từ request:", `'${password}'`);
        console.log("Hash từ database:", `'${user.password_hash}'`, "Độ dài:", user.password_hash.length);
        console.log("Kết quả so sánh (passwordIsValid):", passwordIsValid);
        console.log("--- KẾT THÚC DEBUG ---");

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Email hoặc mật khẩu không chính xác."
            });
        }

        // Tạo token
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        // Trả về kết quả
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

    } catch (error) {
         if (error.kind === "not_found") {
            return res.status(404).send({ message: "Email hoặc mật khẩu không chính xác." });
        }
        console.error("Lỗi server khi đăng nhập:", error);
        return res.status(500).send({ message: "Đã xảy ra lỗi server." });
    }
};