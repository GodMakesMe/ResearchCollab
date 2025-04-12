const pool = require('../db/db');


const getAllFaculty = async (req, res) => {
  try {
    const { search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const validSortColumns = ['name', 'email', 'department', 'phone'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const searchQuery = `%${search.toLowerCase()}%`;

    // Total count
    const countResult = await pool.query(
      `
      SELECT COUNT(*) FROM Faculty f
      JOIN Users u ON f.user_id = u.user_id
      WHERE 
        LOWER(u.name) LIKE $1 OR 
        LOWER(u.email) LIKE $1 OR 
        LOWER(f.department) LIKE $1
      `,
      [searchQuery]
    );
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    // Data query
    const result = await pool.query(
      `
      SELECT 
        f.faculty_id,
        f.department,
        u.user_id,
        u.name,
        u.email,
        u.phone
      FROM Faculty f
      JOIN Users u ON f.user_id = u.user_id
      WHERE 
        LOWER(u.name) LIKE $1 OR 
        LOWER(u.email) LIKE $1 OR 
        LOWER(f.department) LIKE $1
      ORDER BY ${sortColumn} ${order}
      LIMIT $2 OFFSET $3;
      `,
      [searchQuery, limit, offset]
    );

    // Response
    res.json({
      faculty: result.rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page
      }
    });

  } catch (err) {
    console.error('Error fetching faculty:', err.message);
    res.status(500).send('Server error');
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
