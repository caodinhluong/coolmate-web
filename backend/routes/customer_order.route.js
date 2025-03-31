var express = require('express');
var router = express.Router();
const customer_orderController = require("../controllers/customer_order.controller");

router.get('/', customer_orderController.getAll);
router.get('/:id', customer_orderController.getById);
router.get('/pending', customer_orderController.getPending);
router.get('/non-pending', customer_orderController.getNonPending);
router.post('/', customer_orderController.create);
router.delete('/:id', customer_orderController.delete);

module.exports = router;
