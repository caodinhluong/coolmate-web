var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Khởi tạo app
var app = express();

// --- CẤU HÌNH MIDDLEWARE (Nên đặt tập trung ở đây) ---

// Cho phép các request từ domain khác (CORS)
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'exp://172.20.10.6:19000', 
        'http://172.20.10.6:8081'   
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/images', express.static(path.join(__dirname, 'images'))); 

// Ghi log request ra console
app.use(logger('dev'));

// Xử lý body của request có Content-Type là application/json
app.use(express.json());

// Xử lý body của request có Content-Type là application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Xử lý cookies
app.use(cookieParser());

// Phục vụ các file tĩnh trong thư mục 'public' (ví dụ: ảnh, css, js)
app.use(express.static(path.join(__dirname, 'public')));


// --- CẤU HÌNH VIEW ENGINE (Nếu bạn dùng) ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// --- CÁC ROUTES CỦA ỨNG DỤNG ---
const cart_detailsRoutes = require('./routes/cart_details.route');
const cartsRoutes = require('./routes/carts.route');
const categoriesRoutes = require('./routes/categories.route');
const feedbacksRoutes = require('./routes/feedbacks.route');
const order_detailsRoutes = require('./routes/order_details.route');
const ordersRoutes = require('./routes/orders.route');
const productsRoutes = require('./routes/products.route');
const sales_promotionsRoutes = require('./routes/sales_promotions.route');
const usersRoutes = require('./routes/users.route');
const vouchersRoutes = require('./routes/vouchers.route');
const authRoutes = require('./routes/auth.route'); // Nếu bạn có route cho auth

// Lưu ý: Tên route nên nhất quán. Ví dụ: /carts thay vì /cartss
app.use('/cart-details', cart_detailsRoutes);
app.use('/carts', cartsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/feedbacks', feedbacksRoutes);
app.use('/order-details', order_detailsRoutes);
app.use('/orders', ordersRoutes); // Đổi từ /orderss -> /orders cho chuẩn
app.use('/products', productsRoutes);
app.use('/sales-promotions', sales_promotionsRoutes);
app.use('/users', usersRoutes);
app.use('/vouchers', vouchersRoutes);
app.use('/auth', authRoutes); // Route cho xác thực người dùng


// --- XỬ LÝ LỖI ---

// Bắt lỗi 404 (Không tìm thấy route) và chuyển đến error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler tổng
app.use(function (err, req, res, next) {
  // set locals, chỉ cung cấp thông tin lỗi trong môi trường development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render trang lỗi
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
