const db = require("../common/db");

const products = (products) => {
  this.product_id = products.product_id;
  this.name = products.name;
  this.description = products.description;
  this.price = products.price;
  this.stock = products.stock;
  this.category_id = products.category_id;
  this.image_url = products.image_url;
  this.title = products.title;
};

products.getById = (id, callback) => {
  const sqlString = "SELECT * FROM products WHERE product_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

products.getAll = (callback) => {
  const sqlString = "SELECT * FROM products ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

products.insert = (products, callBack) => {
  const sqlString = "INSERT INTO products SET ?";
  db.query(sqlString, products, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...products });
  });
};

products.update = (products, id, callBack) => {
  const sqlString = "UPDATE products SET ? WHERE product_id = ?";
  db.query(sqlString, [products, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

products.delete = (id, callBack) => {
  db.query("DELETE FROM products WHERE product_id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

/**
 * Tìm sản phẩm theo title (khớp chính xác)
 * @param {string} title - Title chính xác của sản phẩm cần tìm
 * @param {function(err, data)} callback - Hàm callback để trả về kết quả
 */
products.findByTitle = (title, callback) => {
  // Sử dụng dấu "=" để tìm kiếm các sản phẩm có title khớp chính xác.
  const sqlString = "SELECT * FROM products WHERE title = ?";

  db.query(sqlString, [title], (err, result) => {
    if (err) {
      console.error("Lỗi khi tìm sản phẩm theo title: ", err);
      return callback(err, null);
    }

    if (result.length) {
      // Nếu có kết quả, trả về mảng các sản phẩm tìm được
      callback(null, result);
    } else {
      // Nếu không tìm thấy sản phẩm nào, trả về lỗi "not_found"
      // Điều này hữu ích để controller biết và trả về lỗi 404
      callback({ kind: "not_found" }, null);
    }
  });
};

/**
 * Tìm sản phẩm theo tên (khớp gần đúng)
 * @param {string} name - Tên hoặc một phần tên của sản phẩm cần tìm
 * @param {function(err, data)} callback - Hàm callback để trả về kết quả
 */
products.findByName = (name, callback) => {
  // Sử dụng LIKE để tìm kiếm các sản phẩm có tên chứa chuỗi tìm kiếm
  const sqlString = "SELECT * FROM products WHERE name LIKE ?";

  // Thêm ký tự % để tìm kiếm chuỗi con
  const searchTerm = `%${name}%`;

  db.query(sqlString, [searchTerm], (err, result) => {
    if (err) {
      console.error("Lỗi khi tìm sản phẩm theo tên: ", err);
      return callback(err, null);
    }

    if (result.length) {
      // Nếu có kết quả, trả về mảng các sản phẩm tìm được
      callback(null, result);
    } else {
      // Nếu không tìm thấy sản phẩm nào, trả về lỗi "not_found"
      callback({ kind: "not_found" }, null);
    }
  });
};
products.getSuggestions = (name, callback) => {
  // Tìm kiếm các sản phẩm có tên BẮT ĐẦU BẰNG chuỗi tìm kiếm
  // Giới hạn kết quả trả về (ví dụ 5-10 gợi ý là đủ)
  const sqlString = "SELECT product_id, name FROM products WHERE name LIKE ? LIMIT 7";
  
  // Thêm ký tự % vào cuối chuỗi để tìm kiếm
  const searchTerm = `${name}%`;

  db.query(sqlString, [searchTerm], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy gợi ý tìm kiếm: ", err);
      return callback(err, null);
    }
    // Trả về kết quả kể cả khi nó là mảng rỗng
    callback(null, result);
  });
};
/**
 * Tìm tất cả sản phẩm thuộc về một danh mục cụ thể.
 * @param {number} categoryId - ID của danh mục cần tìm sản phẩm.
 * @param {function(err, data)} callback - Hàm callback để trả về kết quả.
 */
products.findByCategoryId = (categoryId, callback) => {
  const sqlString = "SELECT * FROM products WHERE category_id = ?";

  db.query(sqlString, [categoryId], (err, result) => {
    if (err) {
      console.error("Lỗi khi tìm sản phẩm theo category_id: ", err);
      return callback(err, null);
    }

    // Trả về mảng các sản phẩm tìm được, kể cả khi nó là mảng rỗng.
    // Component frontend sẽ xử lý trường hợp không có sản phẩm.
    callback(null, result);
  });
};
module.exports = products;