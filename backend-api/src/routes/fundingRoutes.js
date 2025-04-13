const express = require('express');
const { getAllFunding, addFunding, editFunding, partiallyUpdateFunding, deleteFunding } = require('../controllers/fundingController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { partialUpdateFaculty } = require('../controllers/facultyController');

const router = express.Router();

router.get('/', getAllFunding);
router.delete('/:funding_id', authenticateAdmin, deleteFunding);
router.patch('/:funding_id', authenticateAdmin, partiallyUpdateFunding);
router.put('/:funding_id', authenticateAdmin, editFunding);
router.post('/', authenticateAdmin, addFunding);

module.exports = router;
