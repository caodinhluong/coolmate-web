var express = require('express');
var router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get('/', cartController.getAll);
router.get('/:id', cartController.getById);
router.post('/', cartController.insert);
router.put('/:id', cartController.update);
router.delete('/:id', cartController.delete);

module.exports = router;
