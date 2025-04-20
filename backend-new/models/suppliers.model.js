const db = require("../common/db");
const suppliers = (suppliers) => {
this.supplier_id = suppliers.supplier_id;
this.supplier_name = suppliers.supplier_name;
this.contact_name = suppliers.contact_name;
this.phone = suppliers.phone;
this.email = suppliers.email;
this.address = suppliers.address;
this.created_at = suppliers.created_at;
};
suppliers.getById = (id, callback) => {
  const sqlString = "SELECT * FROM suppliers WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

suppliers.getAll = (callback) => {
  const sqlString = "SELECT * FROM suppliers ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

suppliers.insert = (suppliers, callBack) => {
  const sqlString = "INSERT INTO suppliers SET ?";
  db.query(sqlString, suppliers, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...suppliers });
  });
};

suppliers.update = (suppliers, id, callBack) => {
  const sqlString = "UPDATE suppliers SET ? WHERE id = ?";
  db.query(sqlString, [suppliers, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

suppliers.delete = (id, callBack) => {
  db.query("DELETE FROM suppliers WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = suppliers;
