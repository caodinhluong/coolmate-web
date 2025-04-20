
const db = require("../common/db");

const orders =  (orders) => {
  this.order_id = orders.order_id;
  this.status = orders.status;
  this.order_date = orders.order_date;
  this.payment_method = orders.payment_method;
  this.voucher_id = orders.voucher_id;
  this.total_amount = orders.total_amount;
  this.address = orders.address;
  this.customer_name = orders.customer_name;
  this.phone = orders.phone;
  this.created_at = orders.created_at;
};

orders.getById = (id, callback) => {
  const sqlString = "SELECT * FROM orders WHERE order_id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
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
  // Kiểm tra dữ liệu đầu vào
  if (
    !orderData ||
    !orderData.payment_method ||
    !orderData.total_amount ||
    !orderData.address ||
    !orderData.customer_name ||
    !orderData.phone
  ) {
    return callback(new Error("Thiếu thông tin bắt buộc: payment_method, total_amount, address, customer_name, phone"));
  }
  if (!orderDetailsData || !Array.isArray(orderDetailsData) || orderDetailsData.length === 0) {
    return callback(new Error("Chi tiết đơn hàng không hợp lệ hoặc rỗng"));
  }
  for (const detail of orderDetailsData) {
    if (!detail.product_id || !detail.quantity || !detail.price) {
      return callback(new Error("Chi tiết đơn hàng thiếu product_id, quantity hoặc price"));
    }
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Lỗi khi lấy kết nối:", err);
      return callback(err);
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Lỗi khi bắt đầu giao dịch:", err);
        connection.release();
        return callback(err);
      }

      // Chèn vào bảng orders
      const orderSql = `
        INSERT INTO orders (status, order_date, payment_method, voucher_id, total_amount, address, customer_name, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const orderValues = [
        orderData.status || "pending",
        orderData.order_date || new Date(),
        orderData.payment_method,
        orderData.voucher_id || null,
        orderData.total_amount,
        orderData.address,
        orderData.customer_name,
        orderData.phone,
      ];

      console.log("Thực hiện INSERT orders:", orderSql, orderValues); // Log để debug

      connection.query(orderSql, orderValues, (err, orderResult) => {
        if (err || !orderResult) {
          console.error("Lỗi khi chèn orders:", err || "orderResult là undefined");
          connection.rollback(() => {
            connection.release();
            return callback(err || new Error("Không thể chèn đơn hàng"));
          });
          return;
        }

        const orderId = orderResult.insertId;
        console.log("orderId:", orderId); // Log để xác nhận orderId

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

        console.log("Thực hiện INSERT order_details:", detailSql, detailValues); // Log để debug

        connection.query(detailSql, [detailValues], (err, detailResult) => {
          if (err) {
            console.error("Lỗi khi chèn order_details:", err);
            connection.rollback(() => {
              connection.release();
              return callback(err);
            });
            return;
          }

          connection.commit((err) => {
            if (err) {
              console.error("Lỗi khi commit giao dịch:", err);
              connection.rollback(() => {
                connection.release();
                return callback(err);
              });
              return;
            }

            connection.release();
            console.log("Giao dịch thành công, order_id:", orderId);
            callback(null, { order_id: orderId, details: detailResult });
          });
        });
      });
    });
  });
};

module.exports = orders;
