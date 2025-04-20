import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế của bạn

export class CategoryService {
    // Lấy danh sách danh mục
    async getCategories() {
        try {
            const response = await axios.get(`${API_BASE_URL}/categoriess`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            return [];
        }
    }

    // Tạo danh mục mới
    async createCategory(category) {
        try {
            const response = await axios.post(`${API_BASE_URL}/categoriess`, category);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error);
            throw error;
        }
    }

    // Cập nhật danh mục
    async updateCategory(category) {
        try {
            const response = await axios.put(`${API_BASE_URL}/categoriess/${category.id}`, category);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            throw error;
        }
    }

    // Xóa danh mục
    async deleteCategory(id) {
        try {
            await axios.delete(`${API_BASE_URL}/categoriess/${id}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            throw error;
        }
    }
}