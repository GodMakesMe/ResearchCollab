const pool = require('../db/db');

const getAllFunding = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM funding');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all funding');
  }
};

const addFunding = async (req, res) => {
  const { projectid, source, amount, utilization_status } = req.body;
  try {
    await pool.query('INSERT INTO funding (projectid, source, amount, utilization_status) VALUES ($1, $2, $3, $4)', [projectid, source, amount, utilization_status]);
    res.status(201).send('Funding details updated');
  } catch (err) {
    res.status(500).send('Error adding funding details');
  }
};

module.exports = { getAllFunding, addFunding };
