const express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.get('/protected', authMiddleware, authController.protectedRoute);

module.exports = router;
