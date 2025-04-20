var express = require('express');
var router = express.Router();
const import_invoice_detailsController = require("../controllers/import_invoice_details.controller");

router.get('/', import_invoice_detailsController.getAll);
router.get('/:id', import_invoice_detailsController.getById);
router.post('/', import_invoice_detailsController.insert);
router.put('/:id', import_invoice_detailsController.update);
router.delete('/:id', import_invoice_detailsController.delete);

module.exports = router;
