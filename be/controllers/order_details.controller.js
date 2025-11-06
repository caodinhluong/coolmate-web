const OrderDetails = require("../models/order_details.model.js");

module.exports = {
  getAll: (req, res) => {
    OrderDetails.getAll((err, result) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách chi tiết đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy danh sách chi tiết đơn hàng", error: err });
      }
      res.status(200).json(result);
    });
  },

  getById: (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID chi tiết đơn hàng không hợp lệ" });
    }
    OrderDetails.getById(id, (err, result) => {
      if (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng", error: err });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
      }
      res.status(200).json(result[0]);
    });
  },

  getByOrderId: (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }
    OrderDetails.getByOrderId(orderId, (err, result) => {
      if (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng theo order_id:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng theo order_id", error: err });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng cho đơn hàng này" });
      }
      res.status(200).json(result);
    });
  },

  create: (req, res) => {
    const orderDetails = req.body;
    if (
      !orderDetails.order_id ||
      !orderDetails.product_id ||
      !orderDetails.quantity ||
      !orderDetails.price
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc: order_id, product_id, quantity, price" });
    }

    OrderDetails.create(orderDetails, (err, result) => {
      if (err) {
        console.error("Lỗi khi tạo chi tiết đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server khi tạo chi tiết đơn hàng", error: err });
      }
      res.status(201).json({
        message: "Tạo chi tiết đơn hàng thành công",
        order_detail_id: result.insertId,
        ...orderDetails,
      });
    });
  },
};