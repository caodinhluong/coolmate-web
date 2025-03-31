var express = require('express');
var router = express.Router();
const customer_order_detailController = require("../controllers/customer_order_detail.controller");

router.get('/', customer_order_detailController.getAll);
router.get('/:id', customer_order_detailController.getById);

module.exports = router;
