const db = require("../common/db");
const supplier = (supplier) => {
this.id = supplier.id;
this.name = supplier.name;
this.contact_name = supplier.contact_name;
this.phone = supplier.phone;
this.email = supplier.email;
this.address = supplier.address;
this.created_at = supplier.created_at;
};
supplier.getById = (id, callback) => {
  const sqlString = "SELECT * FROM supplier WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

supplier.getAll = (callback) => {
  const sqlString = "SELECT * FROM supplier ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

supplier.insert = (supplier, callBack) => {
  const sqlString = "INSERT INTO supplier SET ?";
  db.query(sqlString, supplier, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...supplier });
  });
};

supplier.update = (supplier, id, callBack) => {
  const sqlString = "UPDATE supplier SET ? WHERE id = ?";
  db.query(sqlString, [supplier, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

supplier.delete = (id, callBack) => {
  db.query("DELETE FROM supplier WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = supplier;
