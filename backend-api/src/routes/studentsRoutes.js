const express = require('express');
const { getAllStudents, addStudents } = require('../controllers/studentsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllStudents);
router.post('/', authenticateAdmin, addStudents);

module.exports = router;
