import api from './api'; // Điều chỉnh đường dẫn theo cấu trúc thư mục của bạn

// Hàm đăng nhập
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { accessToken, user };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Network error');
    }
  }
};

// Hàm đăng xuất
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Lấy thông tin user từ localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Kiểm tra xem user đã đăng nhập chưa
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};