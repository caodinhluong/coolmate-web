const db = require("../common/db");
const product = (product) => {
this.id = product.id;
this.name = product.name;
this.mota = product.mota;
this.price = product.price;
this.category_id = product.category_id;
this.image_url = product.image_url;
this.title = product.title;
this.supplier_id = product.supplier_id;
};
product.getById = (id, callback) => {
  const sqlString = "SELECT * FROM product WHERE id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

product.getAll = (callback) => {
  const sqlString = "SELECT * FROM product ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

product.insert = (product, callBack) => {
  const sqlString = "INSERT INTO product SET ?";
  db.query(sqlString, product, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...product });
  });
};

product.update = (product, id, callBack) => {
  const sqlString = "UPDATE product SET ? WHERE id = ?";
  db.query(sqlString, [product, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

product.delete = (id, callBack) => {
  db.query("DELETE FROM product WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = product;
