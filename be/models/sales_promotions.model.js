const db = require("../common/db");
const sales_promotions = (sales_promotions) => {
this.promotion_id = sales_promotions.promotion_id;
this.name = sales_promotions.name;
this.product_id = sales_promotions.product_id;
this.discount = sales_promotions.discount;
this.start_date = sales_promotions.start_date;
this.end_date = sales_promotions.end_date;
this.created_at = sales_promotions.created_at;
};
sales_promotions.getById = (id, callback) => {
  const sqlString = "SELECT * FROM sales_promotions WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

sales_promotions.getAll = (callback) => {
  const sqlString = "SELECT * FROM sales_promotions ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

sales_promotions.insert = (sales_promotions, callBack) => {
  const sqlString = "INSERT INTO sales_promotions SET ?";
  db.query(sqlString, sales_promotions, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...sales_promotions });
  });
};

sales_promotions.update = (sales_promotions, id, callBack) => {
  const sqlString = "UPDATE sales_promotions SET ? WHERE id = ?";
  db.query(sqlString, [sales_promotions, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

sales_promotions.delete = (id, callBack) => {
  db.query("DELETE FROM sales_promotions WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = sales_promotions;
