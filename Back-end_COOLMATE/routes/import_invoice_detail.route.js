var express = require('express');
var router = express.Router();
const import_invoice_detailController = require("../controllers/import_invoice_detail.controller");

router.get('/', import_invoice_detailController.getAll);
router.get('/:id', import_invoice_detailController.getById);
router.post('/', import_invoice_detailController.insert);
router.put('/:id', import_invoice_detailController.update);
router.delete('/:id', import_invoice_detailController.delete);

module.exports = router;
