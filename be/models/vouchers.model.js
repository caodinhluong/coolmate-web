const db = require("../common/db");
const vouchers = (vouchers) => {
this.voucher_id = vouchers.voucher_id;
this.name = vouchers.name;
this.discount = vouchers.discount;
this.quantity = vouchers.quantity;
this.validity_period = vouchers.validity_period;
this.conditions = vouchers.conditions;
this.description = vouchers.description;
this.created_at = vouchers.created_at;
};
vouchers.getById = (id, callback) => {
  const sqlString = "SELECT * FROM vouchers WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

vouchers.getAll = (callback) => {
  const sqlString = "SELECT * FROM vouchers ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

vouchers.insert = (vouchers, callBack) => {
  const sqlString = "INSERT INTO vouchers SET ?";
  db.query(sqlString, vouchers, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...vouchers });
  });
};

vouchers.update = (vouchers, id, callBack) => {
  const sqlString = "UPDATE vouchers SET ? WHERE id = ?";
  db.query(sqlString, [vouchers, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

vouchers.delete = (id, callBack) => {
  db.query("DELETE FROM vouchers WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = vouchers;
