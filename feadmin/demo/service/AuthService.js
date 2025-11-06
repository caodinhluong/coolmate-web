
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/'; // Thay đổi port nếu cần

const register = async (full_name, email, password) => {
    try {
        const response = await axios.post(API_URL + 'register', {
            full_name,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        throw new Error(message);
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
            email,
            password,
        });

        if (response.data.accessToken) {
            // Lưu thông tin người dùng và token vào localStorage
            // Điều này giúp duy trì trạng thái đăng nhập sau khi tải lại trang
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.accessToken);
        }

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

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;