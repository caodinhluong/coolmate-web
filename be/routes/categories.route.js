var express = require('express');
var router = express.Router();
const categoriesController = require("../controllers/categories.controller");

router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);
router.post('/', categoriesController.insert);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);

module.exports = router;
