const pool = require('../db/db');

const getAllFaculty = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM faculty');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching faculty');
  }
};

const addFaculty = async (req, res) => {
  const { userid, department } = req.body;
  try {
    await pool.query('INSERT INTO faculty (userid, department) VALUES ($1, $2)', [userid, department]);
    res.status(201).send('Faculty list updated');
  } catch (err) {
    res.status(500).send('Error adding faculty details');
  }
};

module.exports = { getAllFaculty, addFaculty };
