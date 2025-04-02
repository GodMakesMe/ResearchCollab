const express = require('express');
const { getAllFunding, addFunding } = require('../controllers/fundingController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllFunding);
router.post('/', authenticateAdmin, addFunding);

module.exports = router;
