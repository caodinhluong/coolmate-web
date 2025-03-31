var express = require('express');
var router = express.Router();
const import_invoiceController = require("../controllers/import_invoice.controller");

router.get('/', import_invoiceController.getAll);
router.get('/:id', import_invoiceController.getById);
router.post('/', import_invoiceController.insert);
router.put('/:id', import_invoiceController.update);
router.delete('/:id', import_invoiceController.delete);

module.exports = router;
