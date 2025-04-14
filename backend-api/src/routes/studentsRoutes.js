const express = require('express');
const { getAllStudents, addStudents, getStudents, deleteStudents, editStudents, partialUpdateStudents } = require('../controllers/studentsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStudents);
router.get('/all-students', getAllStudents);
router.delete('/:student_id', authenticateAdmin, deleteStudents);
router.put('/:student_id', authenticateAdmin, editStudents);
router.patch('/:student_id', authenticateAdmin, partialUpdateStudents);
router.post('/:student_id/:enrollment_year/:program', authenticateAdmin, addStudents);




module.exports = router;
