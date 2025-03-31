var express = require('express');
var router = express.Router();
const sale_prController = require("../controllers/sale_pr.controller");

router.get('/', sale_prController.getAll);
router.get('/:id', sale_prController.getById);
router.post('/', sale_prController.insert);
router.put('/:id', sale_prController.update);
router.delete('/:id', sale_prController.delete);

module.exports = router;
