var express = require('express');
var router = express.Router();
const ordersController = require("../controllers/orders.controller");

router.get('/', ordersController.getAll);
router.post('/orders', ordersController.createOrder);
router.put('/status/:id', ordersController.updateStatus);
router.get('/pending', ordersController.getPending);
router.get('/non-pending', ordersController.getNonPending);
router.get('/monthly-revenue', ordersController.getMonthlyRevenue);
router.get('/best-selling', ordersController.getBestSelling);
router.get('/soldist', ordersController.getSoldList);
router.get('/overview', ordersController.getOverview);

module.exports = router;
