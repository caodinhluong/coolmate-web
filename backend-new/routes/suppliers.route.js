var express = require('express');
var router = express.Router();
const suppliersController = require("../controllers/suppliers.controller");

router.get('/', suppliersController.getAll);
router.get('/:id', suppliersController.getById);
router.post('/', suppliersController.insert);
router.put('/:id', suppliersController.update);
router.delete('/:id', suppliersController.delete);

module.exports = router;
