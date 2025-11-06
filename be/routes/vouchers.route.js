var express = require('express');
var router = express.Router();
const vouchersController = require("../controllers/vouchers.controller");

router.get('/', vouchersController.getAll);
router.get('/:id', vouchersController.getById);
router.post('/', vouchersController.insert);
router.put('/:id', vouchersController.update);
router.delete('/:id', vouchersController.delete);

module.exports = router;
