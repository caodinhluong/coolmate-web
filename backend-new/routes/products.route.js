var express = require('express');
var router = express.Router();
const productsController = require("../controllers/products.controller");

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', productsController.insert);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

module.exports = router;
