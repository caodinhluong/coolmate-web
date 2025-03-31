const db = require("../common/db");
const feedback = (feedback) => {
this.id = feedback.id;
this.user_id = feedback.user_id;
this.message = feedback.message;
this.product_id = feedback.product_id;
this.rating = feedback.rating;
this.create_at = feedback.create_at;
};
feedback.getById = (id, callback) => {
  const sqlString = "SELECT * FROM feedback WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

feedback.getAll = (callback) => {
  const sqlString = "SELECT * FROM feedback ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

feedback.insert = (feedback, callBack) => {
  const sqlString = "INSERT INTO feedback SET ?";
  db.query(sqlString, feedback, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...feedback });
  });
};

feedback.update = (feedback, id, callBack) => {
  const sqlString = "UPDATE feedback SET ? WHERE id = ?";
  db.query(sqlString, [feedback, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

feedback.delete = (id, callBack) => {
  db.query("DELETE FROM feedback WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = feedback;
