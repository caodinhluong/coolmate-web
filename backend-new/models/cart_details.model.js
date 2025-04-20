const db = require("../common/db");
const cart_details = (cart_details) => {
this.cart_detail_id = cart_details.cart_detail_id;
this.cart_id = cart_details.cart_id;
this.product_id = cart_details.product_id;
this.quantity = cart_details.quantity;
this.size = cart_details.size;
this.created_at = cart_details.created_at;
};
cart_details.getById = (id, callback) => {
  const sqlString = "SELECT * FROM cart_details WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM cart_details ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart_details.insert = (cart_details, callBack) => {
  const sqlString = "INSERT INTO cart_details SET ?";
  db.query(sqlString, cart_details, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...cart_details });
  });
};

cart_details.update = (cart_details, id, callBack) => {
  const sqlString = "UPDATE cart_details SET ? WHERE id = ?";
  db.query(sqlString, [cart_details, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

cart_details.delete = (id, callBack) => {
  db.query("DELETE FROM cart_details WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = cart_details;
