var express = require('express');
var router = express.Router();
const feedbacksController = require("../controllers/feedbacks.controller");

router.get('/', feedbacksController.getAll);
router.get('/:id', feedbacksController.getById);
router.post('/', feedbacksController.insert);
router.put('/:id', feedbacksController.update);
router.delete('/:id', feedbacksController.delete);

module.exports = router;
