const express = require('express');
const { login, register } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { submitRegistrationRequest } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticateAdmin, register);
router.post('/register-request', submitRegistrationRequest);
module.exports = router;
