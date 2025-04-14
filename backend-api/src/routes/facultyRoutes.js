const express = require('express');
const { getAllFaculty, addFaculty, editFaculty, deleteFaculty, partialUpdateFaculty } = require('../controllers/facultyController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllFaculty);
router.post('/add', authenticateAdmin, addFaculty);
router.put('/edit/:faculty_id', authenticateAdmin, editFaculty); // Assuming you want to edit faculty with a specific ID
router.patch('/edit/:faculty_id', authenticateAdmin, partialUpdateFaculty); // Assuming you want to partially edit faculty with a specific ID
router.delete('/delete/:faculty_id', authenticateAdmin, deleteFaculty); // Assuming you want to delete faculty with a specific ID


module.exports = router;
