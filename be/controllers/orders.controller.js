const Orders = require("../models/orders.model.js");

module.exports = {
  getMonthlyRevenue: (req, res) => {
    const year = req.query.year || new Date().getFullYear(); // Lấy năm từ query, mặc định là năm hiện tại
    Orders.getMonthlyRevenue(parseInt(year), (err, data) => {
      if (err) res.status(500).send({ message: err.message });
      else res.send(data);
    });
  },
  getBestSelling: (req, res) => {
    const options = {
      limit: parseInt(req.query.limit) || 10,
      startDate: req.query.startDate, // ví dụ: '2024-01-01'
      endDate: req.query.endDate,     // ví dụ: '2024-12-31'
    };
    Orders.getBestSellingProducts(options, (err, data) => {
      if (err) res.status(500).send({ message: err.message });
      else res.send(data);
    });
  },
  getSoldList: (req, res) => {
    const options = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    Order.getSoldProductsList(options, (err, data) => {
      if (err) res.status(500).send({ message: err.message });
      else res.send(data);
    });
  },
  getOverview: (req, res) => {
    Orders.getOverviewStats((err, data) => {
      if (err) res.status(500).send({ message: err.message });
      else res.send(data);
    });
  },
  getAll: (req, res) => {
    Orders.getAll((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn", error: err });
      }
      res.status(200).json(result);
    });
  },

  // getById: (req, res) => {
  //   const id = parseInt(req.params.id, 10);
  //   if (isNaN(id)) {
  //     return res.status(400).json({ message: "ID hóa đơn không hợp lệ fukk" });
  //   }
  //   Orders.getById(id, (err, result) => {
  //     if (err) {
  //       return res.status(500).json({ message: "Lỗi khi lấy hóa đơn", error: err });
  //     }
  //     if (result.length === 0) {
  //       return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
  //     }
  //     res.status(200).json(result[0]);
  //   });
  // },

  getPending: (req, res) => {
    Orders.getPending((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn đang chờ xử lý", error: err });
      }
      res.status(200).json(result);
    });
  },

  getNonPending: (req, res) => {
    Orders.getNonPending((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn không ở trạng thái chờ xử lý", error: err });
      }
      res.status(200).json(result);
    });
  },

  updateStatus: (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID hóa đơn không hợp lệ " });
    }
    if (!status) {
      return res.status(400).json({ message: "Trạng thái mới là bắt buộc" });
    }

    Orders.updateStatus(id, status, (err, result) => {
      if (err) {
        if (err.message === "No order found with the provided ID") {
          return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }
        return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái hóa đơn", error: err });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái hóa đơn thành công",
        order_id: result.order_id,
        status: result.status,
      });
    });
  },

  createOrder: (req, res) => {
    // ... (phần lấy dữ liệu và validation của bạn giữ nguyên)
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
      status, // sẽ có giá trị undefined nếu client không gửi, model sẽ xử lý
      payment_method,
      voucher_id, // sẽ có giá trị undefined nếu client không gửi, model sẽ xử lý
      total_amount,
      address,
      customer_name,
      phone,
    };


    // Gọi hàm create từ model
    Orders.create(orderData, order_details, (err, createdOrder) => {
      if (err) {
        console.error("Lỗi khi tạo hóa đơn:", err);
        return res.status(500).json({ message: "Lỗi server khi tạo hóa đơn", error: err.message });
      }

      // ========================================================
      // ===== SỬA ĐỔI CHÍNH LÀ Ở ĐÂY ===========================
      // ========================================================

      // `createdOrder` bây giờ là một object đầy đủ từ model đã sửa:
      // { order_id, status, total_amount, customer_name, ... }

      // Trả về toàn bộ đối tượng `createdOrder` cho client
      res.status(201).json(createdOrder);

    });
  },

};