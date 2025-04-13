const express = require('express');
const {query1, query2, query3, query4, query5, query6, query7, query8, query9, query10, query11} = require('../controllers/queriesController');
const router = express.Router();
const pool = require('../db/db');
const {authenticateAdmin} = require('../middleware/authMiddleware');

router.get('/query1', query1);
router.get('/query2', query2);
router.get('/query3', query3);
router.get('/query4', query4);
router.get('/query5', query5);
router.get('/query6', query6);
router.get('/query7', query7);
router.get('/query8', query8);
router.get('/query9', query9);
router.get('/query10', query10);
router.get('/query11', query11);
router.get('/query12', async (req, res) => {
    const { minExpertise } = req.body;
  
    if (!minExpertise || isNaN(minExpertise)) {
      return res.status(400).json({ error: "Invalid minExpertise value" });
    }
  
    try {
      const result = await pool.query(`
        SELECT 
          f.faculty_id, 
          f.name, 
          COUNT(fe.expertise_id) AS expertise_count
        FROM Faculty f
        JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
        GROUP BY f.faculty_id, f.name
        HAVING COUNT(fe.expertise_id) > $1
        ORDER BY expertise_count DESC;
      `, [minExpertise]);
  
      res.json(result.rows);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;