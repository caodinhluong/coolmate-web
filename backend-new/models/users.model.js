const db = require("../common/db");
const users = (users) => {
this.user_id = users.user_id;
this.email = users.email;
this.password_hash = users.password_hash;
this.full_name = users.full_name;
this.birth_date = users.birth_date;
this.gender = users.gender;
this.phone = users.phone;
this.address = users.address;
this.avatar_url = users.avatar_url;
this.role = users.role;
this.created_at = users.created_at;
this.updated_at = users.updated_at;
};
users.getById = (id, callback) => {
  const sqlString = "SELECT * FROM users WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

users.getAll = (callback) => {
  const sqlString = "SELECT * FROM users ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

users.insert = (users, callBack) => {
  const sqlString = "INSERT INTO users SET ?";
  db.query(sqlString, users, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...users });
  });
};

users.update = (users, id, callBack) => {
  const sqlString = "UPDATE users SET ? WHERE id = ?";
  db.query(sqlString, [users, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

users.delete = (id, callBack) => {
  db.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = users;
