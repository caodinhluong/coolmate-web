const Orders = require("../models/orders.model.js");

module.exports = {
  getAll: (req, res) => {
    Orders.getAll((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn", error: err });
      }
      res.status(200).json(result);
    });
  },

  getById: (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID hóa đơn không hợp lệ" });
    }
    Orders.getById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy hóa đơn", error: err });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
      }
      res.status(200).json(result[0]);
    });
  },

  createOrder: (req, res) => {
    const { status, payment_method, voucher_id, total_amount, address, customer_name, phone, order_details } = req.body;

    if (!payment_method || !total_amount || !address || !customer_name || !phone || !order_details || !Array.isArray(order_details)) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc hoặc order_details không hợp lệ" });
    }

    for (const detail of order_details) {
      if (!detail.product_id || !detail.quantity || !detail.price) {
        return res.status(400).json({ message: "Chi tiết hóa đơn thiếu product_id, quantity hoặc price" });
      }
    }

    const orderData = {
      status,
      payment_method,
      voucher_id,
      total_amount,
      address,
      customer_name,
      phone,
    };

    Orders.create(orderData, order_details, (err, result) => {
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
