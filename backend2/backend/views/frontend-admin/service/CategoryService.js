import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Điều chỉnh theo port backend của bạn

export class CategoryService {
    // Lấy danh sách danh mục
    async getCategories({ limit = 10, page = 1 } = {}) {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`, {
                params: { limit, page } // Truyền tham số phân trang
            });
            return response.data; // Trả về { data, meta }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error.response?.data?.message || error.message);
            return { data: [], meta: { limit, page, total: 0 } }; // Trả về mặc định khi lỗi
        }
    }

    // Tạo danh mục mới
    async createCategory(category) {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, category);
            return response.data.data; // Trả về dữ liệu danh mục vừa tạo
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Cập nhật danh mục
    async updateCategory(category) {
        try {
            const response = await axios.put(`${API_BASE_URL}/categories/${category.id}`, category);
            return response.data; // Trả về { message: 'Updated successfully' }
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Xóa danh mục
    async deleteCategory(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
            return response.data; // Trả về { message: 'Deleted successfully' }
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }
}