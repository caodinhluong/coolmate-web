const db = require("../common/db");
const import_invoice_detail = (import_invoice_detail) => {
this.id = import_invoice_detail.id;
this.import_invoice_id = import_invoice_detail.import_invoice_id;
this.product_size_id = import_invoice_detail.product_size_id;
this.quantity = import_invoice_detail.quantity;
this.unit_price = import_invoice_detail.unit_price;
this.total_price = import_invoice_detail.total_price;
};
import_invoice_detail.getById = (id, callback) => {
  const sqlString = "SELECT * FROM import_invoice_detail WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice_detail.getAll = (callback) => {
  const sqlString = "SELECT * FROM import_invoice_detail ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice_detail.insert = (import_invoice_detail, callBack) => {
  const sqlString = "INSERT INTO import_invoice_detail SET ?";
  db.query(sqlString, import_invoice_detail, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...import_invoice_detail });
  });
};

import_invoice_detail.update = (import_invoice_detail, id, callBack) => {
  const sqlString = "UPDATE import_invoice_detail SET ? WHERE id = ?";
  db.query(sqlString, [import_invoice_detail, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

import_invoice_detail.delete = (id, callBack) => {
  db.query("DELETE FROM import_invoice_detail WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = import_invoice_detail;
