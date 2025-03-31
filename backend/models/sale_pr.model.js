const db = require("../common/db");
const sale_pr = (sale_pr) => {
this.id = sale_pr.id;
this.name = sale_pr.name;
this.product_id = sale_pr.product_id;
this.discount = sale_pr.discount;
this.start_date = sale_pr.start_date;
this.end_date = sale_pr.end_date;
};
sale_pr.getById = (id, callback) => {
  const sqlString = "SELECT * FROM sale_pr WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

sale_pr.getAll = (callback) => {
  const sqlString = "SELECT * FROM sale_pr ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

sale_pr.insert = (sale_pr, callBack) => {
  const sqlString = "INSERT INTO sale_pr SET ?";
  db.query(sqlString, sale_pr, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...sale_pr });
  });
};

sale_pr.update = (sale_pr, id, callBack) => {
  const sqlString = "UPDATE sale_pr SET ? WHERE id = ?";
  db.query(sqlString, [sale_pr, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

sale_pr.delete = (id, callBack) => {
  db.query("DELETE FROM sale_pr WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = sale_pr;
