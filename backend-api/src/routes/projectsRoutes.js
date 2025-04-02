const express = require('express');
const { getAllProjects, addProjects } = require('../controllers/projectsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', authenticateAdmin, addProjects);

module.exports = router;
