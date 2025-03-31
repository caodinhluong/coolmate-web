const db = require("../common/db");

// Hàm tạo object User
const user = (userData) => {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password; // Mật khẩu lưu dưới dạng text (nên mã hóa sau)
    this.phone = userData.phone;
    this.address = userData.address;
    this.role = userData.role;
    this.avt_url = userData.avt_url;
    this.gender = userData.gender;
    this.username = userData.username;
};

// Phương thức getById
user.getById = (id, callback) => {
    const sqlString = "SELECT * FROM User WHERE id = ?";
    db.query(sqlString, id, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(result);
    });
};

// Phương thức getAll
user.getAll = (callback) => {
    const sqlString = "SELECT * FROM User";
    db.query(sqlString, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(result);
    });
};

// Phương thức insert
user.insert = (userData, callback) => {
    const sqlString = "INSERT INTO User SET ?";
    db.query(sqlString, userData, (err, res) => {
        if (err) {
            callback(err);
            return;
        }
        callback({ id: res.insertId, ...userData });
    });
};

// Phương thức update
user.update = (userData, id, callback) => {
    const sqlString = "UPDATE User SET ? WHERE id = ?";
    db.query(sqlString, [userData, id], (err, res) => {
        if (err) {
            callback(err);
            return;
        }
        callback("Cập nhật người dùng id = " + id + " thành công");
    });
};

// Phương thức delete
user.delete = (id, callback) => {
    const sqlString = "DELETE FROM User WHERE id = ?";
    db.query(sqlString, id, (err, res) => {
        if (err) {
            callback(err);
            return;
        }
        callback("Xóa người dùng id = " + id + " thành công");
    });
};

// Xuất module
module.exports = user;