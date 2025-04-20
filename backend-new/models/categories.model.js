const db = require("../common/db");
const categories = (categories) => {
this.category_id = categories.category_id;
this.category_name = categories.category_name;
this.description = categories.description;
this.created_at = categories.created_at;
};
categories.getById = (id, callback) => {
  const sqlString = "SELECT * FROM categories WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

categories.getAll = (callback) => {
  const sqlString = "SELECT * FROM categories ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

categories.insert = (categories, callBack) => {
  const sqlString = "INSERT INTO categories SET ?";
  db.query(sqlString, categories, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...categories });
  });
};

categories.update = (categories, id, callBack) => {
  const sqlString = "UPDATE categories SET ? WHERE category_id = ?";
  db.query(sqlString, [categories, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

categories.delete = (id, callBack) => {
  db.query("DELETE FROM categories WHERE category_id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = categories;
