var express = require('express');
var router = express.Router();
const cartsController = require("../controllers/carts.controller");

router.get('/', cartsController.getAll);
router.get('/:id', cartsController.getById);
router.post('/', cartsController.insert);
router.put('/:id', cartsController.update);
router.delete('/:id', cartsController.delete);

module.exports = router;
