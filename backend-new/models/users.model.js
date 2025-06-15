const db = require("../common/db");
const bcrypt = require('bcryptjs');  

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

users.findByEmail = (email, callback) => {
    const sqlString = "SELECT * FROM users WHERE email = ?";
    db.query(sqlString, [email], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        if (result.length) {
            // Trả về người dùng đầu tiên tìm thấy
            return callback(null, result[0]);
        }
        // Không tìm thấy người dùng
        return callback({ kind: "not_found" }, null);
    });
};
users.getById = (id, callback) => {
  const sqlString = "SELECT * FROM users WHERE user_id = ? ";
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

users.insert = (newUser, callBack) => {
    // 1. Kiểm tra xem email đã tồn tại chưa
    User.findByEmail(newUser.email, (err, user) => {
        if (user) {
            // Nếu tìm thấy user, tức là email đã tồn tại
            return callBack({ kind: "email_exists" }, null);
        }

        // Nếu email chưa tồn tại, tiếp tục quá trình đăng ký
        // 2. Mã hóa mật khẩu
        bcrypt.hash(newUser.password, 10, (err, hash) => { // Giả sử FE gửi 'password'
            if (err) {
                return callBack(err, null);
            }
            
            newUser.password_hash = hash; // Gán mật khẩu đã mã hóa
            delete newUser.password; // Xóa mật khẩu thô

            // 3. Insert vào DB
            const sqlString = "INSERT INTO users SET ?";
            db.query(sqlString, newUser, (err, res) => {
                if (err) {
                    return callBack(err, null);
                }
                // Không trả lại hash mật khẩu
                delete newUser.password_hash;
                callBack(null, { user_id: res.insertId, ...newUser });
            });
        });
    });
};



users.update = (users, id, callBack) => {
  const sqlString = "UPDATE users SET ? WHERE user_id = ?";
  db.query(sqlString, [users, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật nhân viên id = " + id + " thành công");
  });
};

users.delete = (id, callBack) => {
  db.query("DELETE FROM users WHERE user_id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa nhân viên id = " + id + " thành công");
  });
};

module.exports = users;
