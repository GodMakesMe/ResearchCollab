const pool = require('../db/db');

const getPendingRequests = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const offset = (page - 1) * limit;

    // Sanitize sortBy to prevent SQL injection
    const validSortFields = ['id', 'name', 'email', 'phone', 'role'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    // Count total results for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM registration_requests WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${search}%`]
    );
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paged and sorted results
    const result = await pool.query(
      `SELECT * FROM registration_requests
       WHERE name ILIKE $1 OR email ILIKE $1
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    res.json({
      requests: result.rows,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (err) {
    console.error(err);
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
