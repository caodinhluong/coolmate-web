var express = require('express');
var router = express.Router();
const order_detailsController = require("../controllers/order_details.controller");

router.get('/', order_detailsController.getAll);
router.get('/:id', order_detailsController.getById);
router.get('/order/:orderId', order_detailsController.getByOrderId);

module.exports = router;
