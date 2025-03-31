var express = require('express');
var router = express.Router();
const voucherController = require("../controllers/voucher.controller");

router.get('/', voucherController.getAll);
router.get('/:id', voucherController.getById);
router.post('/', voucherController.insert);
router.put('/:id', voucherController.update);
router.delete('/:id', voucherController.delete);

module.exports = router;
