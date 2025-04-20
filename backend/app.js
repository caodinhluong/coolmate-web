var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());



const cartRoutes = require('./routes/cart.route');
const cart_detailRoutes = require('./routes/cart_detail.route');
const categoryRoutes = require('./routes/category.route');
const customer_orderRoutes = require('./routes/customer_order.route');
const customer_order_detailRoutes = require('./routes/customer_order_detail.route');
const feedbackRoutes = require('./routes/feedback.route');
const import_invoiceRoutes = require('./routes/import_invoice.route');
const import_invoice_detailRoutes = require('./routes/import_invoice_detail.route');
const productRoutes = require('./routes/product.route');
const product_sizeRoutes = require('./routes/product_size.route');
const sale_prRoutes = require('./routes/sale_pr.route');
const supplierRoutes = require('./routes/supplier.route');
const userRoutes = require('./routes/user.route');
const voucherRoutes = require('./routes/voucher.route');
const authRoutes = require('./routes/auth.route');

app.use('/carts', cartRoutes);
app.use('/cart-details', cart_detailRoutes);
app.use('/categorys', categoryRoutes);
app.use('/customer-orders', customer_orderRoutes);
app.use('/customer-order-details', customer_order_detailRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/import-invoices', import_invoiceRoutes);
app.use('/import-invoice-details', import_invoice_detailRoutes);
app.use('/products', productRoutes);
app.use('/product-sizes', product_sizeRoutes);
app.use('/sale-prs', sale_prRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/users', userRoutes);
app.use('/vouchers', voucherRoutes);
// app.use('/auth', authRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.put('/category/:id', (req, res) => {
  console.log("req.body:", req.body); // In dữ liệu từ Postman
  console.log("req.params.id:", req.params.id); // In ID từ URL
  res.send({ message: "Dữ liệu nhận được", body: req.body });
});


app.put('/category/:id', (req, res) => {
  console.log("req.body:", req.body); // In dữ liệu từ Postman
  console.log("req.params.id:", req.params.id); // In ID từ URL
  res.send({ message: "Dữ liệu nhận được", body: req.body });
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
