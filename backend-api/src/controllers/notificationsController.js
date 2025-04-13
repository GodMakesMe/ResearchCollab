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

const deleteNotifications = async (req, res) => {
  const { notification_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM notifications WHERE notification_id = $1', [notification_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Notification not found');
    }
    res.status(200).send('Notification deleted successfully');
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).send('Error deleting notification details');
  }
}

const editNotifications = async (req, res) => {
  const { notification_id } = req.params;
  const { userid, message, craeted_at, is_read } = req.body;
  try {
    const result = await pool.query('UPDATE notifications SET userid = $1, message = $2, craeted_at = $3, is_read = $4 WHERE notification_id = $5', [userid, message, craeted_at, is_read, notification_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Notification not found');
    }
    res.status(200).send('Notification details updated');
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).send('Error updating notification details');
  }
}

module.exports = { getAllNotifications, addNotifications, editNotifications, deleteNotifications };
