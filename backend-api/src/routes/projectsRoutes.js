const express = require('express');
const { getAllProjects, addProjects, getProjectById, getProjects } = require('../controllers/projectsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/all-projects', getAllProjects);
router.get('/by-id/:id', getProjectById); 
router.get('/', getProjects);
router.post('/', authenticateAdmin, addProjects);

module.exports = router;
