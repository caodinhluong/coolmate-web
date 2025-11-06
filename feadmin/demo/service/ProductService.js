// /demo/service/ProductService.js - PHIÊN BẢN HOÀN THIỆN

const API_BASE_URL = 'http://localhost:3001';

export class ProductService {
    
    // ... (các hàm getProducts, getCategories giữ nguyên) ...
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    }

    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Không thể lấy danh sách danh mục');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            throw error;
        }
    }

    // Hàm an toàn để xử lý response
    async _handleResponse(response) {
        const responseText = await response.text();
        if (!response.ok) {
            try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.sqlMessage || errorData.message || 'Lỗi từ server');
            } catch (e) {
                throw new Error(responseText || 'Lỗi không xác định từ server');
            }
        }

        // SỬA LỖI: Dùng try...catch để parse JSON một cách an toàn
        try {
            // Nếu responseText rỗng, JSON.parse sẽ lỗi, chúng ta sẽ đi vào catch
            return JSON.parse(responseText);
        } catch (e) {
            // Nếu parse thất bại (vì text rỗng hoặc là text thường như "cập nhật thành công"),
            // nhưng response.ok là true, coi như thành công và trả về object mặc định.
            return { success: true, message: responseText };
        }
    }

    async createProduct(product) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Không thể xóa sản phẩm');
            }
            return response.ok;
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            throw error;
        }
    }
}