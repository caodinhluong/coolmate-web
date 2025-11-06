import api from './api'; // Import instance axios đã cấu hình

const OrderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData, orderDetails) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (
        !orderData ||
        !orderData.payment_method ||
        !orderData.total_amount ||
        !orderData.address ||
        !orderData.customer_name ||
        !orderData.phone
      ) {
        throw new Error("Thiếu thông tin bắt buộc: payment_method, total_amount, address, customer_name, phone");
      }
      if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
        throw new Error("Chi tiết đơn hàng không hợp lệ hoặc rỗng");
      }
      for (const detail of orderDetails) {
        if (!detail.product_id || !detail.quantity || !detail.price) {
          throw new Error("Chi tiết đơn hàng thiếu product_id, quantity hoặc price");
        }
      }

      // Dữ liệu gửi lên backend
      const payload = {
        status: orderData.status || "pending",
        payment_method: orderData.payment_method,
        voucher_id: orderData.voucher_id || null,
        total_amount: orderData.total_amount,
        address: orderData.address,
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        order_details: orderDetails,
      };

      console.log("Dữ liệu gửi lên API:", payload);

      // Gửi yêu cầu POST đến endpoint đúng
      const response = await api.post('/orders/orders', payload);

      console.log("Phản hồi API cho createOrder:", response.data);

      // Kiểm tra phản hồi
      if (!response.data || typeof response.data !== 'object') {
        throw new Error("Định dạng phản hồi không hợp lệ");
      }

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw new Error(`Tạo đơn hàng thất bại: ${error.response?.data?.message || error.message}`);
    }
  },
};

export default OrderService;
