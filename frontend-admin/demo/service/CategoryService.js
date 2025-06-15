import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế của bạn

export class CategoryService {
    // Lấy danh sách danh mục
    async getCategories() {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            return [];
        }
    }

    // Tạo danh mục mới
    async createCategory(category) {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, category);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error);
            throw error;
        }
    }

    // Cập nhật danh mục
    async updateCategory(categoryId, categoryData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            throw error;
        }
    }

    // Xóa danh mục
    async deleteCategory(id) {
        try {
            // Hàm này nhận trực tiếp id nên đã đúng, không cần sửa.
            await axios.delete(`${API_BASE_URL}/categories/${id}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            throw error;
        }
    }
}