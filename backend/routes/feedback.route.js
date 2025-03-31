var express = require('express');
var router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.get('/', feedbackController.getAll);
router.get('/:id', feedbackController.getById);
router.post('/', feedbackController.insert);
router.put('/:id', feedbackController.update);
router.delete('/:id', feedbackController.delete);

module.exports = router;
