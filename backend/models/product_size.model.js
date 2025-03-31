const db = require("../common/db");
const product_size = (product_size) => {
this.id = product_size.id;
this.product_id = product_size.product_id;
this.size = product_size.size;
this.stock = product_size.stock;
};
product_size.getById = (id, callback) => {
  const sqlString = "SELECT * FROM product_size WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

product_size.getAll = (callback) => {
  const sqlString = "SELECT * FROM product_size ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

product_size.insert = (product_size, callBack) => {
  const sqlString = "INSERT INTO product_size SET ?";
  db.query(sqlString, product_size, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...product_size });
  });
};

product_size.update = (product_size, id, callBack) => {
  const sqlString = "UPDATE product_size SET ? WHERE id = ?";
  db.query(sqlString, [product_size, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

product_size.delete = (id, callBack) => {
  db.query("DELETE FROM product_size WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = product_size;
