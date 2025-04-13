const express = require('express');
const { getAllProjects, addProjects, getProjectById, getProjects, partialUpdateProject, editProject, deleteProject } = require('../controllers/projectsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/all-projects', getAllProjects);
router.get('/by-id/:id', getProjectById); 
router.get('/', getProjects);
router.post('/', authenticateAdmin, addProjects);
router.put('/:projectId', authenticateAdmin, editProject); // Assuming you want to edit project with a specific ID
router.patch('/:projectId', authenticateAdmin, partialUpdateProject); // Assuming you want to partially edit project with a specific ID
router.delete('/:projectId', authenticateAdmin, deleteProject); // Assuming you want to delete project with a specific ID



module.exports = router;
