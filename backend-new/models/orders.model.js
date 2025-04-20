const db = require("../common/db");
const orders = (orders) => {
this.order_id = orders.order_id;
this.user_id = orders.user_id;
this.status = orders.status;
this.order_date = orders.order_date;
this.payment_method = orders.payment_method;
this.voucher_id = orders.voucher_id;
this.total_amount = orders.total_amount;
this.created_at = orders.created_at;
};
orders.getById = (id, callback) => {
  const sqlString = "SELECT * FROM orders WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

orders.getAll = (callback) => {
  const sqlString = "SELECT * FROM orders ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

orders.getAll = (callback) => {
  const sqlString = "SELECT * FROM orders";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

orders.create = (orderData, orderDetailsData, callback) => {
  db.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return callback(err);
      }

      // Chèn vào bảng orders
      const orderSql = `
        INSERT INTO orders (user_id, status, order_date, payment_method, voucher_id, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const orderValues = [
        orderData.user_id,
        orderData.status || "pending",
        orderData.order_date || new Date(),
        orderData.payment_method,
        orderData.voucher_id || null,
        orderData.total_amount,
      ];

      connection.query(orderSql, orderValues, (err, orderResult) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            return callback(err);
          });
        }

        const orderId = orderResult.insertId;

        // Chèn vào bảng order_details
        const detailSql = `
          INSERT INTO order_details (order_id, product_id, quantity, price, size)
          VALUES ?
        `;
        const detailValues = orderDetailsData.map((detail) => [
          orderId,
          detail.product_id,
          detail.quantity,
          detail.price,
          detail.size || null,
        ]);

        connection.query(detailSql, [detailValues], (err, detailResult) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              return callback(err);
            });
          }

          connection.commit((err) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                return callback(err);
              });
            }

            connection.release();
            callback(null, { order_id: orderId, details: detailResult });
          });
        });
      });
    });
  });
};


module.exports = orders;
