const db = require("../common/db");
const import_invoice = (import_invoice) => {
this.id = import_invoice.id;
this.supplier_id = import_invoice.supplier_id;
this.user_id = import_invoice.user_id;
this.import_date = import_invoice.import_date;
this.total_amount = import_invoice.total_amount;
this.status = import_invoice.status;
};
import_invoice.getById = (id, callback) => {
  const sqlString = "SELECT * FROM import_invoice WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice.getAll = (callback) => {
  const sqlString = "SELECT * FROM import_invoice ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice.insert = (import_invoice, callBack) => {
  const sqlString = "INSERT INTO import_invoice SET ?";
  db.query(sqlString, import_invoice, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...import_invoice });
  });
};

import_invoice.update = (import_invoice, id, callBack) => {
  const sqlString = "UPDATE import_invoice SET ? WHERE id = ?";
  db.query(sqlString, [import_invoice, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

import_invoice.delete = (id, callBack) => {
  db.query("DELETE FROM import_invoice WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = import_invoice;
