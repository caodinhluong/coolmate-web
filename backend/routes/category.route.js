var express = require('express');
var router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.insert);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
