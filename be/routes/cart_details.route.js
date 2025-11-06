var express = require('express');
var router = express.Router();
const cart_detailsController = require("../controllers/cart_details.controller");

router.get('/', cart_detailsController.getAll);
router.get('/:id', cart_detailsController.getById);
router.post('/', cart_detailsController.insert);
router.put('/:id', cart_detailsController.update);
router.delete('/:id', cart_detailsController.delete);

module.exports = router;
