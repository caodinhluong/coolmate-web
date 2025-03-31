var express = require('express');
var router = express.Router();
const supplierController = require("../controllers/supplier.controller");

router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', supplierController.insert);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

module.exports = router;
