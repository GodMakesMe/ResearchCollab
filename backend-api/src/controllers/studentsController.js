const pool = require('../db/db');

const getAllStudents = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all students');
  }
};

const addStudents = async (req, res) => {
  const { studentit, userid, enrollment_year, program} = req.body;
  try {
    await pool.query('INSERT INTO students (studentit, userid, enrollment_year, program) VALUES ($1, $2, $3, $4)', [studentit, userid, enrollment_year, program]);
    res.status(201).send('Student details updated');
  } catch (err) {
    res.status(500).send('Error adding students details');
  }
};

module.exports = { getAllStudents, addStudents };
