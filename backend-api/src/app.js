const express = require('express');
const userRoutes = require('./routes/userRoutes');
const pool = require('./db/db'); 

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Database test route
app.get('/db-name', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database();');
    res.json({ database: result.rows[0].current_database });
  } catch (error) {
    console.error('❌ Error fetching database name:', error);
    res.status(500).json({ error: 'Failed to get database name' });
  }
});

module.exports = app;
