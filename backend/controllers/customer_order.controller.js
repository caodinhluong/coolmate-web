const C = require("../models/customer_order.model.js");

module.exports = {
  // Lấy tất cả đơn hàng
  getAll: (req, res) => {
    C.getAll((err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },

  // Lấy đơn hàng theo ID
  getById: (req, res) => {
    const id = req.params.id;
    C.getById(id, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },

  // Lấy đơn hàng có trạng thái "chờ xử lý"
  getPending: (req, res) => {
    C.getPendingOrders((err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },

  // Lấy đơn hàng không có trạng thái "chờ xử lý"
  getNonPending: (req, res) => {
    C.getNonPendingOrders((err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },

  // Tạo đơn hàng mới
  create: (req, res) => {
    const customer_order = req.body.customer_order || {};
    const order_details = req.body.order_details || [];

    C.insert(customer_order, order_details, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },

  // Xóa đơn hàng
  delete: (req, res) => {
    const id = req.params.id;
    C.delete(id, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  },
};