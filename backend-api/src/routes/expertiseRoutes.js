const express = require('express');
const { getAllExpertise, addExpertise, editExpertise, deleteExpertise } = require('../controllers/expertiseController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllExpertise);
router.delete('/:expertise_id', authenticateAdmin, deleteExpertise);
router.post('/', authenticateAdmin, addExpertise);
// router.patch('/:expertise_id', authenticateAdmin, );
router.put('/:expertise_id', authenticateAdmin, editExpertise);

module.exports = router;
