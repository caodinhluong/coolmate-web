var express = require('express');
var router = express.Router();
const sales_promotionsController = require("../controllers/sales_promotions.controller");

router.get('/', sales_promotionsController.getAll);
router.get('/:id', sales_promotionsController.getById);
router.post('/', sales_promotionsController.insert);
router.put('/:id', sales_promotionsController.update);
router.delete('/:id', sales_promotionsController.delete);

module.exports = router;
