const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế

export class SupplierService {
    // Lấy danh sách nhà cung cấp
    async getSuppliers() {
        try {
            const response = await fetch(`${API_BASE_URL}/supplierss`);
            if (!response.ok) throw new Error('Không thể lấy danh sách nhà cung cấp');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách:', error);
            throw error;
        }
    }

    // Tạo nhà cung cấp mới
    async createSupplier(supplier) {
        try {
            console.log('Dữ liệu gửi lên:', supplier); // Debug
            const response = await fetch(`${API_BASE_URL}/suppliers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplier),
            });
            if (!response.ok) throw new Error('Không thể tạo nhà cung cấp');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tạo:', error);
            throw error;
        }
    }

    // Cập nhật nhà cung cấp
    async updateSupplier(supplier) {
        try {
            const response = await fetch(`${API_BASE_URL}/suppliers/${supplier.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplier),
            });
            if (!response.ok) throw new Error('Không thể cập nhật nhà cung cấp');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            throw error;
        }
    }

    // Xóa nhà cung cấp
    async deleteSupplier(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Không thể xóa nhà cung cấp với ID: ${id}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            throw error;
        }
    }
}