const db = require("../common/db");
const import_invoices = (import_invoices) => {
this.invoice_id = import_invoices.invoice_id;
this.supplier_id = import_invoices.supplier_id;
this.staff_id = import_invoices.staff_id;
this.total_amount = import_invoices.total_amount;
this.invoice_date = import_invoices.invoice_date;
this.created_at = import_invoices.created_at;
};
import_invoices.getById = (id, callback) => {
  const sqlString = "SELECT * FROM import_invoices WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoices.getAll = (callback) => {
  const sqlString = "SELECT * FROM import_invoices ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoices.insert = (import_invoices, callBack) => {
  const sqlString = "INSERT INTO import_invoices SET ?";
  db.query(sqlString, import_invoices, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...import_invoices });
  });
};

import_invoices.update = (import_invoices, id, callBack) => {
  const sqlString = "UPDATE import_invoices SET ? WHERE id = ?";
  db.query(sqlString, [import_invoices, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

import_invoices.delete = (id, callBack) => {
  db.query("DELETE FROM import_invoices WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = import_invoices;
