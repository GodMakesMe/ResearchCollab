const pool = require('../db/db');

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
};

const addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).send('User added');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
};

module.exports = { getAllUsers, addUser };
