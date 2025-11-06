const API_BASE_URL = 'http://localhost:3000'; // Thay bằng URL API thực tế

export class UserService {
    async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            if (!response.ok) throw new Error('Không thể lấy danh sách người dùng');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách:', error);
            throw error;
        }
    }
}