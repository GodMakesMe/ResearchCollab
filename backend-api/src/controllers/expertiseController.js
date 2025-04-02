const pool = require('../db/db');

const getAllExpertise = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM expertise');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all expertise');
  }
};

const addExpertise = async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query('INSERT INTO expertise (name, description) VALUES ($1, $2)', [name, description]);
    res.status(201).send('Expertise list updated');
  } catch (err) {
    res.status(500).send('Error adding expertise details');
  }
};

module.exports = { getAllExpertise, addExpertise };
