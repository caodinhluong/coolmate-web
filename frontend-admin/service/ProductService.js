import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Đồng bộ với CategoryService (giả sử port 3000)

export class ProductService {
    // Lấy danh sách sản phẩm với phân trang
    async getProducts({ limit = 10, page = 1 } = {}) {
        try {
            const url = `${API_BASE_URL}/productss`;
            console.log('Request URL:', url, 'Params:', { limit, page });
            const response = await axios.get(url, {
                params: { limit, page }
            });
            console.log('Response:', response.data);
            return response.data; // Trả về { data, meta: { limit, page, total } }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error.response?.data?.message || error.message);
            return { data: [], meta: { limit, page, total: 0 } }; // Trả về mặc định khi lỗi
        }
    }

    // Lấy toàn bộ sản phẩm không phân trang
    async getAllProducts() {
        try {
            const url = `${API_BASE_URL}/productss/all`;
            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            return response.data.data; // Trả về mảng sản phẩm từ { data }
        } catch (error) {
            console.error('Lỗi khi lấy toàn bộ sản phẩm:', error.response?.data?.message || error.message);
            return []; // Trả về mảng rỗng khi lỗi
        }
    }

    // Lấy sản phẩm theo ID
    async getProductById(id) {
        try {
            const url = `${API_BASE_URL}/productss/${id}`;
            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            return response.data.data; // Trả về dữ liệu sản phẩm từ { data }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo ID:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Lấy danh sách danh mục với phân trang (dùng trong form sản phẩm nếu cần)
    async getCategories() {
        try {
            const url = `${API_BASE_URL}/categoriess/all`;
            console.log('Request URL:', url);
            const response = await axios.get(url);
            console.log('Response:', response.data);
            return response.data; // Trả về { data, meta: { limit, page, total } }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error.response?.data?.message || error.message);
            return { data: [], meta: { limit, page, total: 0 } }; // Trả về mặc định khi lỗi
        }
    }

    // Thêm sản phẩm mới
    async createProduct(product) {
        try {
            const url = `${API_BASE_URL}/productss`;
            console.log('Request URL:', url, 'Data:', product);
            const response = await axios.post(url, product);
            console.log('Response:', response.data);
            return response.data.data; // Trả về dữ liệu sản phẩm vừa tạo từ { data }
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(product) {
        try {
            const url = `${API_BASE_URL}/productss/${product.product_id}`; // Sử dụng product_id thay vì id
            console.log('Request URL:', url, 'Data:', product);
            const response = await axios.put(url, product);
            console.log('Response:', response.data);
            return response.data; // Trả về { message: 'Updated successfully' }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }

    // Xóa sản phẩm
    async deleteProduct(id) {
        try {
            const url = `${API_BASE_URL}/productss/${id}`;
            console.log('Request URL:', url);
            const response = await axios.delete(url);
            console.log('Response:', response.data);
            return response.data; // Trả về { message: 'Deleted successfully' }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error.response?.data?.message || error.message);
            throw error.response?.data || error; // Ném lỗi để xử lý ở nơi gọi
        }
    }
}