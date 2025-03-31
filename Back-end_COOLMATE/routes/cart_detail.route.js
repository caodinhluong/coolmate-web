var express = require('express');
var router = express.Router();
const cart_detailController = require("../controllers/cart_detail.controller");

router.get('/', cart_detailController.getAll);
router.get('/:id', cart_detailController.getById);
router.post('/', cart_detailController.insert);
router.put('/:id', cart_detailController.update);
router.delete('/:id', cart_detailController.delete);

module.exports = router;
