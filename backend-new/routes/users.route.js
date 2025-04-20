var express = require('express');
var router = express.Router();
const usersController = require("../controllers/users.controller");

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.insert);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;
