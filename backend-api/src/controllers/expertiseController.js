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
const deleteExpertise = async (req, res) => {
  const { expertise_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM expertise WHERE expertise_id = $1', [expertise_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Expertise not found');
    }
    res.status(200).send('Expertise deleted successfully');
  } catch (err) {
    console.error('Error deleting expertise:', err);
    res.status(500).send('Error deleting expertise details');
  }
};

const editExpertise = async (req, res) => {
  const { expertise_id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query('UPDATE expertise SET name = $1, description = $2 WHERE expertise_id = $3', [name, description, expertise_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Expertise not found');
    }
    res.status(200).send('Expertise details updated');
  } catch (err) {
    console.error('Error updating expertise:', err);
    res.status(500).send('Error updating expertise details');
  }
};

module.exports = { getAllExpertise, addExpertise, editExpertise, deleteExpertise };
