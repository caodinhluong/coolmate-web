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



const cart_detailsRoutes = require('./routes/cart_details.route');
const cartsRoutes = require('./routes/carts.route');
const categoriesRoutes = require('./routes/categories.route');
const feedbacksRoutes = require('./routes/feedbacks.route');
const import_invoice_detailsRoutes = require('./routes/import_invoice_details.route');
const import_invoicesRoutes = require('./routes/import_invoices.route');
const order_detailsRoutes = require('./routes/order_details.route');
const ordersRoutes = require('./routes/orders.route');
const productsRoutes = require('./routes/products.route');
const sales_promotionsRoutes = require('./routes/sales_promotions.route');
const suppliersRoutes = require('./routes/suppliers.route');
const usersRoutes = require('./routes/users.route');
const vouchersRoutes = require('./routes/vouchers.route');

app.use('/cart-detailss', cart_detailsRoutes);
app.use('/cartss', cartsRoutes);
app.use('/categoriess', categoriesRoutes);
app.use('/feedbackss', feedbacksRoutes);
app.use('/import-invoice-detailss', import_invoice_detailsRoutes);
app.use('/import-invoicess', import_invoicesRoutes);
app.use('/order-detailss', order_detailsRoutes);
app.use('/orderss', ordersRoutes);
app.use('/productss', productsRoutes);
app.use('/sales-promotionss', sales_promotionsRoutes);
app.use('/supplierss', suppliersRoutes);
app.use('/userss', usersRoutes);
app.use('/voucherss', vouchersRoutes);
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
