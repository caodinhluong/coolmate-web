const db = require("../common/db");

const customer_order_detail = function (customer_order_detail) {
  this.id = customer_order_detail.id;
  this.order_id = customer_order_detail.order_id;
  this.product_size_id = customer_order_detail.product_size_id;
  this.quantity = customer_order_detail.quantity;
  this.price = customer_order_detail.price;
};

customer_order_detail.getById = (id, callback) => {
  const sqlString = "SELECT * FROM customer_order_detail WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

customer_order_detail.getAll = (callback) => {
  const sqlString = "SELECT * FROM customer_order_detail ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

// Không cần insert riêng vì đã tích hợp vào sp_order_create trong customer_order
// customer_order_detail.insert đã bị xóa

customer_order_detail.update = (customer_order_detail, id, callback) => {
  const sqlString = "UPDATE customer_order_detail SET ? WHERE id = ?";
  db.query(sqlString, [customer_order_detail, id], (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, "Cập nhật chi tiết hóa đơn id = " + id + " thành công");
  });
};

customer_order_detail.delete = (id, callback) => {
  db.query("DELETE FROM customer_order_detail WHERE id = ?", id, (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, "Xóa chi tiết hóa đơn id = " + id + " thành công");
  });
};

module.exports = customer_order_detail;