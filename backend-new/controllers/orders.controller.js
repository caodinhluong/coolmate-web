const { create } = require("../models/order_details.model.js");
const orders = require("../models/orders.model.js");
const O = require("../models/orders.model.js");

module.exports = {
  getAll: (req, res) => {
    O.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    O.getById(id, (result) => {
      res.send(result);
    });
  },
  
  create: (req, res) => {
    const { user_id, status, payment_method, voucher_id, total_amount, order_details } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!user_id || !payment_method || !total_amount || !order_details || !Array.isArray(order_details)) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc hoặc order_details không hợp lệ" });
    }

    // Kiểm tra chi tiết hóa đơn
    for (const detail of order_details) {
      if (!detail.product_id || !detail.quantity || !detail.price) {
        return res.status(400).json({ message: "Chi tiết hóa đơn thiếu product_id, quantity hoặc price" });
      }
    }

    // Chuẩn bị dữ liệu hóa đơn
    const orderData = {
      user_id,
      status: status || "pending",
      payment_method,
      voucher_id: voucher_id || null,
      total_amount,
    };

    // Gọi phương thức create từ model
    orders.create(orderData, order_details, (err, result) => {
      if (err) {
        console.error("Lỗi khi tạo hóa đơn:", err);
        return res.status(500).json({ message: "Lỗi server khi tạo hóa đơn", error: err });
      }

      res.status(201).json({
        message: "Tạo hóa đơn thành công",
        order_id: result.order_id,
        details: result.details,
      });
    });
  },
 
};
