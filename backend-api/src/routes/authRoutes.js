const express = require('express');
const { login, register, googleLogin, googleRegister } = require('../controllers/authController');
const { submitRegistrationRequest } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/google-login', googleLogin);
router.post('/login', login);
router.post('/google-register', googleRegister);
router.post('/register', authenticateAdmin, register);
router.post('/register-request', submitRegistrationRequest);

module.exports = router;
