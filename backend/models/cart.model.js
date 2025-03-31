const db = require("../common/db");
const cart = (cart) => {
this.id = cart.id;
this.customer_id = cart.customer_id;
};
cart.getById = (id, callback) => {
  const sqlString = "SELECT * FROM cart WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart.getAll = (callback) => {
  const sqlString = "SELECT * FROM cart ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

cart.insert = (cart, callBack) => {
  const sqlString = "INSERT INTO cart SET ?";
  db.query(sqlString, cart, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...cart });
  });
};

cart.update = (cart, id, callBack) => {
  const sqlString = "UPDATE cart SET ? WHERE id = ?";
  db.query(sqlString, [cart, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

cart.delete = (id, callBack) => {
  db.query("DELETE FROM cart WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = cart;
