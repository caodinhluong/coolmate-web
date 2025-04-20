const db = require("../common/db");
const carts = (carts) => {
this.cart_id = carts.cart_id;
this.user_id = carts.user_id;
this.created_at = carts.created_at;
};
carts.getById = (id, callback) => {
  const sqlString = "SELECT * FROM carts WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

carts.getAll = (callback) => {
  const sqlString = "SELECT * FROM carts ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

carts.insert = (carts, callBack) => {
  const sqlString = "INSERT INTO carts SET ?";
  db.query(sqlString, carts, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...carts });
  });
};

carts.update = (carts, id, callBack) => {
  const sqlString = "UPDATE carts SET ? WHERE id = ?";
  db.query(sqlString, [carts, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

carts.delete = (id, callBack) => {
  db.query("DELETE FROM carts WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = carts;
