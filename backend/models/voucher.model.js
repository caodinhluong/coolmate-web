const db = require("../common/db");
const voucher = (voucher) => {
this.id = voucher.id;
this.name = voucher.name;
this.discount = voucher.discount;
this.quantity = voucher.quantity;
this.validity_period = voucher.validity_period;
this.conditional = voucher.conditional;
this.description = voucher.description;
};
voucher.getById = (id, callback) => {
  const sqlString = "SELECT * FROM voucher WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

voucher.getAll = (callback) => {
  const sqlString = "SELECT * FROM voucher ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

voucher.insert = (voucher, callBack) => {
  const sqlString = "INSERT INTO voucher SET ?";
  db.query(sqlString, voucher, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...voucher });
  });
};

voucher.update = (voucher, id, callBack) => {
  const sqlString = "UPDATE voucher SET ? WHERE id = ?";
  db.query(sqlString, [voucher, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

voucher.delete = (id, callBack) => {
  db.query("DELETE FROM voucher WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = voucher;
