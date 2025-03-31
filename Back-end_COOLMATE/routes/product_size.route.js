var express = require('express');
var router = express.Router();
const product_sizeController = require("../controllers/product_size.controller");

router.get('/', product_sizeController.getAll);
router.get('/:id', product_sizeController.getById);
router.post('/', product_sizeController.insert);
router.put('/:id', product_sizeController.update);
router.delete('/:id', product_sizeController.delete);

module.exports = router;
