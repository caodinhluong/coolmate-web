const db = require("../common/db");

// Constructor
const Order = function(order) {
    this.order_id = order.order_id;
    this.status = order.status;
    this.order_date = order.order_date;
    this.payment_method = order.payment_method;
    this.voucher_id = order.voucher_id;
    this.total_amount = order.total_amount;
    this.address = order.address;
    this.customer_name = order.customer_name;
    this.phone = order.phone;
    this.created_at = order.created_at;
};

// ... (các hàm getById, getAll, getPending, getNonPending, updateStatus giữ nguyên) ...

Order.getById = (id, callback) => {
  const sqlString = "SELECT * FROM orders WHERE order_id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

Order.getAll = (callback) => {
  const sqlString = "SELECT * FROM orders";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

Order.getPending = (callback) => {
  const sqlString = "SELECT * FROM orders WHERE status = 'pending'";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

Order.getNonPending = (callback) => {
  const sqlString = "SELECT * FROM orders WHERE status != 'pending'";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

Order.updateStatus = (orderId, newStatus, callback) => {
  if (!orderId || !newStatus) {
    return callback(new Error("Order ID and new status are required"));
  }
  const sqlString = "UPDATE orders SET status = ? WHERE order_id = ?";
  const values = [newStatus, orderId];
  db.query(sqlString, values, (err, result) => {
    if (err) {
      return callback(err);
    }
    if (result.affectedRows === 0) {
      return callback(new Error("No order found with the provided ID"));
    }
    callback(null, { order_id: orderId, status: newStatus });
  });
};

Order.create = (orderData, orderDetailsData, callback) => {
    // ... (Hàm create giữ nguyên) ...
    // Input validation
  if (
    !orderData ||
    !orderData.payment_method ||
    !orderData.total_amount ||
    !orderData.address ||
    !orderData.customer_name ||
    !orderData.phone
  ) {
    return callback(new Error("Missing required fields: payment_method, total_amount, address, customer_name, phone"));
  }
  if (!orderDetailsData || !Array.isArray(orderDetailsData) || orderDetailsData.length === 0) {
    return callback(new Error("Invalid or empty order details"));
  }
  for (const detail of orderDetailsData) {
    if (!detail.product_id || !detail.quantity || !detail.price) {
      return callback(new Error("Order detail missing product_id, quantity, or price"));
    }
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return callback(err);
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        connection.release();
        return callback(err);
      }

      // Insert into orders table
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

      console.log("Executing INSERT orders:", orderSql, orderValues);

      connection.query(orderSql, orderValues, (err, orderResult) => {
        if (err || !orderResult) {
          console.error("Error inserting orders:", err || "orderResult is undefined");
          connection.rollback(() => {
            connection.release();
            return callback(err || new Error("Failed to insert order"));
          });
          return;
        }

        const orderId = orderResult.insertId;
        console.log("orderId:", orderId);

        // Insert into order_details table
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

        console.log("Executing INSERT order_details:", detailSql, detailValues);

        connection.query(detailSql, [detailValues], (err, detailResult) => {
          if (err) {
            console.error("Error inserting order_details:", err);
            connection.rollback(() => {
              connection.release();
              return callback(err);
            });
            return;
          }

          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.release();
                return callback(err);
              });
              return;
            }

            connection.release();
            console.log("Transaction successful, order_id:", orderId);
             // =========================================================
                // ===== SỬA ĐỔI Ở ĐÂY: Trả về dữ liệu đầy đủ hơn ========
                // =========================================================

                // Tạo một đối tượng kết quả hoàn chỉnh
                const createdOrderData = {
                    ...orderData, // Sao chép tất cả dữ liệu đầu vào (name, phone, address, total...)
                    order_id: orderId, // Thêm order_id mới được tạo
                    order_date: orderValues[1], // Lấy ngày tạo từ mảng orderValues (đã được new Date())
                };
                
                // Bây giờ callback sẽ trả về một object hoàn chỉnh
                callback(null, createdOrderData);
          });
        });
      });
    });
  });
};


// =================================================================
// ==========> CÁC HÀM THỐNG KÊ MỚI <==========
// =================================================================

/**
 * 1. Thống kê doanh thu theo tháng của một năm cụ thể
 * @param {number} year - Năm cần thống kê (ví dụ: 2024)
 * @param {function} callback - Callback function
 */
Order.getMonthlyRevenue = (year, callback) => {
    // Trạng thái đơn hàng thành công, có thể là 'completed' hoặc 'shipping' tùy vào logic của bạn
    const COMPLETED_STATUS = 'completed'; 

    const sqlString = `
        SELECT
            MONTH(order_date) AS month,
            SUM(total_amount) AS revenue
        FROM
            orders
        WHERE
            YEAR(order_date) = ? AND status = ?
        GROUP BY
            MONTH(order_date)
        ORDER BY
            month ASC;
    `;
    db.query(sqlString, [year, COMPLETED_STATUS], (err, result) => {
        if (err) {
            return callback(err);
        }
        // Chuyển đổi kết quả thành một mảng 12 tháng, với giá trị 0 cho các tháng không có doanh thu
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            revenue: 0
        }));
        result.forEach(row => {
            monthlyRevenue[row.month - 1].revenue = row.revenue;
        });
        callback(null, monthlyRevenue);
    });
};

/**
 * 2. Thống kê sản phẩm bán chạy nhất
 * @param {object} options - Tùy chọn { limit: số lượng sản phẩm, startDate: ngày bắt đầu, endDate: ngày kết thúc }
 * @param {function} callback - Callback function
 */
Order.getBestSellingProducts = (options, callback) => {
    const { limit = 10, startDate, endDate } = options;
    const COMPLETED_STATUS = 'completed';

    let sqlString = `
        SELECT
            p.product_id,
            p.name,
            p.image_url,
            SUM(od.quantity) AS total_quantity_sold
        FROM
            order_details od
        JOIN
            orders o ON od.order_id = o.order_id
        JOIN
            products p ON od.product_id = p.product_id
        WHERE
            o.status = ?
    `;

    const params = [COMPLETED_STATUS];

    if (startDate && endDate) {
        sqlString += ' AND o.order_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }
    
    sqlString += `
        GROUP BY
            p.product_id, p.name, p.image_url
        ORDER BY
            total_quantity_sold DESC
        LIMIT ?;
    `;
    params.push(limit);

    db.query(sqlString, params, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

/**
 * 3. Lấy danh sách tất cả các sản phẩm đã bán trong một khoảng thời gian
 * @param {object} options - Tùy chọn { startDate: ngày bắt đầu, endDate: ngày kết thúc }
 * @param {function} callback - Callback function
 */
Order.getSoldProductsList = (options, callback) => {
    const { startDate, endDate } = options;
    const COMPLETED_STATUS = 'completed';
    
    let sqlString = `
        SELECT DISTINCT
            p.product_id,
            p.name,
            p.image_url,
            p.price as current_price,
            c.category_name
        FROM
            order_details od
        JOIN
            orders o ON od.order_id = o.order_id
        JOIN
            products p ON od.product_id = p.product_id
        LEFT JOIN
            categories c ON p.category_id = c.category_id
        WHERE
            o.status = ?
    `;

    const params = [COMPLETED_STATUS];

    if (startDate && endDate) {
        sqlString += ' AND o.order_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    sqlString += ' ORDER BY p.name ASC;';

    db.query(sqlString, params, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

/**
 * 4. Thống kê tổng quan: Tổng doanh thu, tổng đơn hàng, tổng sản phẩm đã bán
 * @param {function} callback - Callback function
 */
Order.getOverviewStats = (callback) => {
    const COMPLETED_STATUS = 'completed';
    const sqlString = `
        SELECT
            (SELECT SUM(total_amount) FROM orders WHERE status = ?) AS total_revenue,
            (SELECT COUNT(order_id) FROM orders WHERE status = ?) AS total_orders,
            (SELECT SUM(quantity) FROM order_details od JOIN orders o ON od.order_id = o.order_id WHERE o.status = ?) AS total_products_sold;
    `;
    
    const params = [COMPLETED_STATUS, COMPLETED_STATUS, COMPLETED_STATUS];

    db.query(sqlString, params, (err, result) => {
        if (err) {
            return callback(err);
        }
        // Kết quả trả về là một mảng có 1 phần tử object
        callback(null, result[0]);
    });
};

module.exports = Order;