const db = require("../common/db");
const import_invoice_details = (import_invoice_details) => {
this.detail_id = import_invoice_details.detail_id;
this.invoice_id = import_invoice_details.invoice_id;
this.product_id = import_invoice_details.product_id;
this.quantity = import_invoice_details.quantity;
this.price = import_invoice_details.price;
this.created_at = import_invoice_details.created_at;
};
import_invoice_details.getById = (id, callback) => {
  const sqlString = "SELECT * FROM import_invoice_details WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM import_invoice_details ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

import_invoice_details.insert = (import_invoice_details, callBack) => {
  const sqlString = "INSERT INTO import_invoice_details SET ?";
  db.query(sqlString, import_invoice_details, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...import_invoice_details });
  });
};

import_invoice_details.update = (import_invoice_details, id, callBack) => {
  const sqlString = "UPDATE import_invoice_details SET ? WHERE id = ?";
  db.query(sqlString, [import_invoice_details, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

import_invoice_details.delete = (id, callBack) => {
  db.query("DELETE FROM import_invoice_details WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = import_invoice_details;
