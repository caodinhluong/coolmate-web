// src/services/authService.js - Phiên bản hoàn chỉnh

import axios from 'axios';

const API_URL = 'http://localhost:3001/auth/'; // Thay đổi port nếu cần

/**
 * Gửi yêu cầu đăng nhập đến server
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Dữ liệu trả về từ server, bao gồm user và accessToken
 */
const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
            email,
            password,
        });

        // *** PHẦN QUAN TRỌNG NHẤT ***
        // Kiểm tra xem phản hồi có chứa accessToken không
        if (response.data && response.data.accessToken) {
            // Lưu thông tin người dùng và token vào localStorage
            // JSON.stringify là cần thiết vì localStorage chỉ lưu chuỗi
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.accessToken);
        }

        // Trả về toàn bộ dữ liệu để component có thể sử dụng nếu cần
        return response.data;

    } catch (error) {
        // Ném lỗi ra ngoài để component có thể bắt và hiển thị
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        throw new Error(message);
    }
};

/**
 * Xóa thông tin đăng nhập khỏi localStorage
 */
const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

/**
 * Lấy thông tin người dùng hiện tại từ localStorage
 * @returns {object | null} Đối tượng user hoặc null nếu chưa đăng nhập
 */
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Lỗi khi parse dữ liệu người dùng từ localStorage", e);
            // Xóa dữ liệu hỏng
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    }
    return null;
};

/**
 * Lấy token của người dùng hiện tại từ localStorage
 * @returns {string | null}
 */
const getToken = () => {
    return localStorage.getItem('token');
};


const authService = {
    login,
    logout,
    getCurrentUser,
    getToken, // Thêm hàm này để dễ dàng lấy token cho các request cần xác thực
    // register, (nếu có)
};

export default authService;