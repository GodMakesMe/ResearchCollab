const express = require('express');
// const { query1 } = require('../controllers/queriesController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const pool = require('../db/db');
const {query1} = require('../controllers/queriesController');

router.get('/', query1);
  

module.exports = router;