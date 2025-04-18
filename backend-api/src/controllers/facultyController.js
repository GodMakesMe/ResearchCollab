const pool = require('../db/db');
const bcrypt = require('bcrypt');


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


const editFaculty = async (req, res) => {
  const { faculty_id } = req.params;
  const { userid, department } = req.body;
  try {
    const result = await pool.query('UPDATE faculty SET userid = $1, department = $2 WHERE faculty_id = $3', [userid, department, faculty_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Faculty not found');
    }
    res.status(200).send('Faculty details updated');
  } catch (err) {
    console.error('Error updating faculty:', err);
    res.status(500).send('Error updating faculty details');
  }
}

const deleteFaculty = async (req, res) => {
  const { faculty_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM faculty WHERE faculty_id = $1', [faculty_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Faculty not found');
    }
    res.status(200).send('Faculty deleted successfully');
  } catch (err) {
    console.error('Error deleting faculty:', err);
    res.status(500).send('Error deleting faculty details');
  }
}

const partialUpdateFaculty = async (req, res) => {
  const { faculty_id } = req.params;
  const { department, name, email, phone } = req.body;

  const facultyUpdates = [];
  const values = [];
  let index = 1;

  if (department) {
    facultyUpdates.push(`department = $${index++}`);
    values.push(department);
  }

  try {
    const userFields = { name, email, phone };
    if (Object.values(userFields).some(val => val)) {
      user_id = await pool.query('SELECT user_id FROM faculty WHERE faculty_id = $1', [faculty_id]);
      if (user_id.rowCount === 0 || user_id.rowCount > 1) {
        return res.status(404).send('Faculty not found');
      }
      user_id = user_id.rows[0].user_id;
      await updateUserPartially(user_id, userFields); 
    }

    // Update faculty table if needed
    if (facultyUpdates.length > 0) {
      values.push(faculty_id);
      const query = `UPDATE faculty SET ${facultyUpdates.join(', ')} WHERE faculty_id = $${index}`;
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).send('Faculty not found');
      }
    }

    res.status(200).send('Faculty updated successfully');
  } catch (err) {
    console.error('Error updating faculty:', err.message);
    res.status(500).send('Internal server error');
  }
};

const addFaculty = async (req, res) => {
  const { name, email, phone, password = '123456789', department } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const phoneText = !phone || phone === '' ? '' : ', phone';
    // const phoneValue = !phone || phone === '' ? '' : ', $1', [phone];  
    const phoneValue = !phone || phone === '' ? '' : `, '${phone}'`;
    const queryText = `INSERT INTO users (name, email${phoneText}, role, password) VALUES ('${name}', '${email}' ${phoneValue}, 'faculty', '${hashedPassword}') RETURNING user_id`;
    console.log('Query Text:', queryText);
    const userResult = await pool.query(
      // 'INSERT INTO users (name, email$1, role, password) VALUES ($2, $3 $4, $5, $6) RETURNING user_id',
      // [phoneText, name, email, phoneValue, 'faculty', hashedPassword]
      queryText
    );
    const user_id = userResult.rows[0].user_id;

    await pool.query(
      'INSERT INTO faculty (user_id, department) VALUES ($1, $2)',
      [user_id, department]
    );

    res.status(201).json({ message: 'Faculty added successfully', user_id });
  } catch (err) {
    console.error('Error adding faculty:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllFaculty, addFaculty, editFaculty, deleteFaculty, partialUpdateFaculty };
