var express = require('express');
var router = express.Router();
const ordersController = require("../controllers/orders.controller");

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getById);
router.post('/orders', ordersController.createOrder);

module.exports = router;
