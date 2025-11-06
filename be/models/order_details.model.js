const db = require("../common/db");

const order_details = (order_details) => {
  this.order_detail_id = order_details.order_detail_id;
  this.order_id = order_details.order_id;
  this.product_id = order_details.product_id;
  this.quantity = order_details.quantity;
  this.price = order_details.price;
  this.size = order_details.size;
  this.created_at = order_details.created_at;
};

order_details.getById = (id, callback) => {
  const sqlString = "SELECT * FROM order_details WHERE order_detail_id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

order_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM order_details";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

order_details.getByOrderId = (orderId, callback) => {
  const sqlString = "SELECT * FROM order_details WHERE order_id = ?";
  db.query(sqlString, orderId, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

order_details.create = (detailData, callback) => {
  const sqlString = `
    INSERT INTO order_details (order_id, product_id, quantity, price, size)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    detailData.order_id,
    detailData.product_id,
    detailData.quantity,
    detailData.price,
    detailData.size || null,
  ];

  db.query(sqlString, values, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = order_details;