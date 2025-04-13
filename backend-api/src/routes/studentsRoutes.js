const express = require('express');
const { getAllStudents, addStudents, getStudents, deleteStudents, editStudents } = require('../controllers/studentsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStudents);
router.post('/', authenticateAdmin, addStudents);



module.exports = router;
