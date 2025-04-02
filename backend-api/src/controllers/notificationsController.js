const pool = require('../db/db');

const getAllNotifications = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all notifications');
  }
};

const addNotifications = async (req, res) => {
  const { userid, message, craeted_at, is_read } = req.body;
  try {
    await pool.query('INSERT INTO notifications (userid, message, craeted_at, is_read) VALUES ($1, $2, $3, $4)', [userid, message, craeted_at, is_read]);
    res.status(201).send('Notifications details updated');
  } catch (err) {
    res.status(500).send('Error adding notifications details');
  }
};

module.exports = { getAllNotifications, addNotifications };
