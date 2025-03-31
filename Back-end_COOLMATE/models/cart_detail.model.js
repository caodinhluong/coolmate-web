const db = require("../common/db");
const cart_detail = (cart_detail) => {
this.id = cart_detail.id;
this.cart_id = cart_detail.cart_id;
this.product_size_id = cart_detail.product_size_id;
this.quantity = cart_detail.quantity;
};
cart_detail.getById = (id, callback) => {
  const sqlString = "SELECT * FROM cart_detail WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart_detail.getAll = (callback) => {
  const sqlString = "SELECT * FROM cart_detail ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart_detail.insert = (cart_detail, callBack) => {
  const sqlString = "INSERT INTO cart_detail SET ?";
  db.query(sqlString, cart_detail, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...cart_detail });
  });
};

cart_detail.update = (cart_detail, id, callBack) => {
  const sqlString = "UPDATE cart_detail SET ? WHERE id = ?";
  db.query(sqlString, [cart_detail, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

cart_detail.delete = (id, callBack) => {
  db.query("DELETE FROM cart_detail WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = cart_detail;
