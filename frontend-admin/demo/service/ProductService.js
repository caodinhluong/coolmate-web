const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế

export class ProductService {
    
    // Lấy danh sách sản phẩm
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/productss`);
            if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    }

    // Lấy danh sách danh mục
    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categoriess`);
            if (!response.ok) throw new Error('Không thể lấy danh sách danh mục');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            throw error;
        }
    }

    // Thêm sản phẩm mới
    async createProduct(product) {
        try {
            const response = await fetch(`${API_BASE_URL}/productss`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) throw new Error('Không thể tạo sản phẩm');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
            throw error;
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(product) {
        try {
            const response = await fetch(`${API_BASE_URL}/productss/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) throw new Error('Không thể cập nhật sản phẩm');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            throw error;
        }
    }

    // Xóa sản phẩm
    async deleteProduct(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/productss/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Không thể xóa sản phẩm');
            return response.ok;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            throw error;
        }
    }
}