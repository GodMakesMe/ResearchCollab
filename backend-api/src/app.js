const express = require('express');
const userRoutes = require('./routes/userRoutes');
const pool = require('./db/db');
const { authenticateAdmin } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const expertiseRoutes = require('./routes/expertiseRoutes');
// const facultyExpertiseRoutes = require('./routes/facultyExpertiseRoutes');
const studentRoutes = require('./routes/studentsRoutes');
// const studentExpertiseRoutes = require('./routes/studentExpertiseRoutes');
const fundingRoutes = require('./routes/fundingRoutes'); //funding details
const projectRoutes = require('./routes/projectsRoutes'); //funding research_projects
const notificationsRoutes = require('./routes/notificationsRoutes'); //notifications
const registrationRoutes = require('./routes/registrationRoutes');
const { authenticateUser } = require('./middleware/authMiddleware');
const cors = require('cors');


const app = express();
app.use(express.json());

// Routes
app.use('/users', authenticateAdmin, userRoutes);
app.use('/faculty', authenticateUser, facultyRoutes);
app.use('/expertise', expertiseRoutes);
// app.use('/faculty/expertise', facultyExpertiseRoutes);
app.use('/students', studentRoutes);
// app.use('/students/expertise', studentExpertiseRoutes);
app.use('/funding', fundingRoutes);  //funding details
app.use('/projects', projectRoutes); //funding research_projects
app.use('/notifications', notificationsRoutes); //notifications
app.use(cors()); // Enable CORS for all routes
app.use('/api/auth', authRoutes);
app.use('/api/registration', authenticateAdmin, registrationRoutes);

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
