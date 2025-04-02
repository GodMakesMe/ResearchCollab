const pool = require('../db/db');

const getAllProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM research_projects');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all projects');
  }
};

const addProjects = async (req, res) => {
  const { title, description, start_data, end_date, status, faculty_id } = req.body;
  try {
    await pool.query('INSERT INTO projects (title, description, start_data, end_date, status, faculty_id) VALUES ($1, $2, $3, $4, $5, $6)', [title, description, start_data, end_date, status, faculty_id]);
    res.status(201).send('Projects details updated');
  } catch (err) {
    res.status(500).send('Error adding projects details');
  }
};

module.exports = { getAllProjects, addProjects };
