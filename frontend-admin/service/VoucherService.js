import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; 

export class VoucherService {
    // Lấy danh sách voucher
    async getVouchers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/vouchers`); // Giả sử endpoint là /vouchers
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách voucher:', error);
            return [];
        }
    }

    // Tạo voucher mới
    async createVoucher(voucher) {
        try {
            const response = await axios.post(`${API_BASE_URL}/vouchers`, voucher);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo voucher:', error);
            throw error; // Ném lỗi để xử lý ở component
        }
    }

    // Cập nhật voucher
    async updateVoucher(voucher) {
        try {
            const response = await axios.put(`${API_BASE_URL}/vouchers/${voucher.id}`, voucher);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật voucher:', error);
            throw error; // Ném lỗi để xử lý ở component
        }
    }

    // Xóa voucher
    async deleteVoucher(id) {
        try {
            await axios.delete(`${API_BASE_URL}/vouchers/${id}`);
            return true; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            throw error; // Ném lỗi để xử lý ở component
        }
    }
}