const express = require('express');
const { getAllExpertise, addExpertise } = require('../controllers/expertiseController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllExpertise);
router.post('/', authenticateAdmin, addExpertise);

module.exports = router;
