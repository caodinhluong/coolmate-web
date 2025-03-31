const db = require("../common/db");
const category = (category) => {
this.id = category.id;
this.name = category.name;
this.mota = category.mota;
};
category.getById = (id, callback) => {
  const sqlString = "SELECT * FROM category WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

category.getAll = (callback) => {
  const sqlString = "SELECT * FROM category ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

category.insert = (category, callBack) => {
  const sqlString = "INSERT INTO category SET ?";
  db.query(sqlString, category, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...category });
  });
};

category.update = (category, id, callBack) => {
  const sqlString = "UPDATE category SET ? WHERE id = ?";
  db.query(sqlString, [category, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

category.delete = (id, callBack) => {
  db.query("DELETE FROM category WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = category;
