const express = require('express');
const { getAllFaculty, addFaculty } = require('../controllers/facultyController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllFaculty);
router.post('/register', authenticateAdmin, addFaculty);

module.exports = router;
