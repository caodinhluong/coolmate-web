import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Điều chỉnh theo port backend của bạn

export class CategoryService {
    // Lấy danh sách danh mục với phân trang
    async getCategories({ limit = 10, page = 1 } = {}) {
        try {
            const url = `${API_BASE_URL}/categories`;
            console.log('Request URL:', url, 'Params:', { limit, page });
            const response = await axios.get(url, {
                params: { limit, page }
            });
            console.log('Response:', response.data);
            return response.data; // Trả về { data, meta: { limit, page, total } }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error.response?.data?.message || error.message);
            return { data: [], meta: { limit, page, total: 0 } }; // Trả về dữ liệu mặc định khi lỗi
        }
    }

    // Lấy toàn bộ danh mục không phân trang
    async getAllCategories() {
        try {
            const url = `${API_BASE_URL}/categories/all`;
            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            return response.data.data; // Trả về mảng danh mục từ { data }
        } catch (error) {
            console.error('Lỗi khi lấy toàn bộ danh mục:', error.response?.data?.message || error.message);
            return []; // Trả về mảng rỗng khi lỗi
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(id) {
        try {
            const url = `${API_BASE_URL}/categories/${id}`;
            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            return response.data.data; // Trả về dữ liệu danh mục từ { data }
        } catch (error) {
            console.error('Lỗi khi lấy danh mục theo ID:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Tạo danh mục mới
    async createCategory(category) {
        try {
            const url = `${API_BASE_URL}/categories`;
            console.log('Request URL:', url, 'Data:', category);
            const response = await axios.post(url, category);
            console.log('Response:', response.data);
            return response.data.data; // Trả về dữ liệu danh mục vừa tạo từ { data }
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Cập nhật danh mục
    async updateCategory(category) {
        try {
            const url = `${API_BASE_URL}/categories/${category.id}`;
            console.log('Request URL:', url, 'Data:', category);
            const response = await axios.put(url, category);
            console.log('Response:', response.data);
            return response.data; // Trả về { message: 'Updated successfully' }
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Xóa danh mục
    async deleteCategory(id) {
        try {
            const url = `${API_BASE_URL}/categories/${id}`;
            console.log('Request URL:', url);
            const response = await axios.delete(url);
            console.log('Response:', response.data);
            return response.data; // Trả về { message: 'Deleted successfully' }
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }
}