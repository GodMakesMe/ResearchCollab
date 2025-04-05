const pool = require('../db/db');

const getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registration_requests WHERE status = $1', ['pending']);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
};

const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await pool.query('SELECT * FROM registration_requests WHERE id = $1', [requestId]);
    if (!request.rows.length) return res.status(404).json({ message: 'Request not found' });

    const { name, email, phone, role, password } = request.rows[0];
    await pool.query(
      'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, role, password]
    );
    await pool.query('DELETE FROM registration_requests WHERE id = $1', [requestId]);

    res.json({ message: 'Request approved and user added' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving request' });
  }
};

const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    await pool.query('DELETE FROM registration_requests WHERE id = $1', [requestId]);
    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

module.exports = { getPendingRequests, approveRequest, rejectRequest };
