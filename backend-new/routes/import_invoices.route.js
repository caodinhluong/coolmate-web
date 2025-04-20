var express = require('express');
var router = express.Router();
const import_invoicesController = require("../controllers/import_invoices.controller");

router.get('/', import_invoicesController.getAll);
router.get('/:id', import_invoicesController.getById);
router.post('/', import_invoicesController.insert);
router.put('/:id', import_invoicesController.update);
router.delete('/:id', import_invoicesController.delete);

module.exports = router;
