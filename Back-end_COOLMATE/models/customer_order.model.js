const db = require("../common/db");

const customer_order = function (customer_order) {
  this.id = customer_order.id;
  this.user_id = customer_order.user_id;
  this.status = customer_order.status;
  this.order_date = customer_order.order_date;
  this.payment_method = customer_order.payment_method;
  this.voucher_id = customer_order.voucher_id;
};

// Lấy đơn hàng theo ID
customer_order.getById = (id, callback) => {
  const sqlString = "SELECT * FROM customer_order WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

// Lấy tất cả đơn hàng
customer_order.getAll = (callback) => {
  const sqlString = "SELECT * FROM customer_order";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

// Lấy đơn hàng có trạng thái "chờ xử lý"
customer_order.getPendingOrders = (callback) => {
  const sqlString = "SELECT * FROM customer_order WHERE status = 'chờ xử lý'";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

// Lấy đơn hàng không có trạng thái "chờ xử lý"
customer_order.getNonPendingOrders = (callback) => {
  const sqlString = "SELECT * FROM customer_order WHERE status != 'chờ xử lý'";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

// Thêm đơn hàng mới
customer_order.insert = (orderData, orderDetailData, callback) => {
  const sqlString = "CALL sp_order_create(?, ?, ?, ?, ?, ?, ?)";
  const params = [
    orderData.id || require('uuid').v4(),
    orderData.user_id,
    orderData.status,
    orderData.order_date,
    orderData.payment_method,
    orderData.voucher_id || null,
    orderDetailData ? JSON.stringify(orderDetailData) : null
  ];

  db.query(sqlString, params, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, { id: orderData.id, ...orderData });
  });
};

// Xóa đơn hàng
customer_order.delete = (id, callback) => {
  db.query("DELETE FROM customer_order WHERE id = ?", id, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, "Xóa hóa đơn id = " + id + " thành công");
  });
};

module.exports = customer_order;