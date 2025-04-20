// src/services/OrderService.js
import api from './api'; // Import instance axios đã cấu hình

const OrderService = {
 
  // Tạo đơn hàng mới
  createOrder: async (customerOrder, orderDetails) => {
    try {
      const response = await api.post('/orderss', {
        customer_order: customerOrder,
        order_details: orderDetails,
      });
      console.log('Phản hồi API cho createOrder:', response);

      let orderData;
      if (response?.data !== undefined) {
        orderData = response.data;
      } else {
        orderData = response;
      }

      console.log('Dữ liệu đơn hàng được tạo:', orderData);

      if (!orderData || typeof orderData !== 'object' || Object.keys(orderData).length === 0) {
        throw new Error('Định dạng phản hồi không hợp lệ: Kỳ vọng dữ liệu đơn hàng');
      }

      console.log('Dữ liệu đơn hàng cuối cùng:', orderData);
      return orderData;
    } catch (error) {
      throw new Error(`Tạo đơn hàng thất bại: ${error.message}`);
    }
  },
};

export default OrderService;