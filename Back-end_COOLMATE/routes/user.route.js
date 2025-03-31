var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller");

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.insert);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
