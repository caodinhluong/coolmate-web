// src/services/VoucherService.js
import api from './api'; // Giả sử bạn đã có file cấu hình axios chung

const VoucherService = {
  /**
   * Lấy tất cả các voucher hợp lệ từ server
   * @returns {Promise<Array>} Mảng các voucher
   */
  getAllVouchers: async () => {
    try {
      const response = await api.get('/vouchers');
      // Dữ liệu trả về từ model của bạn, không cần map lại
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
      // Trả về mảng rỗng để không làm crash giao diện
      return []; 
    }
  },
};

export default VoucherService;