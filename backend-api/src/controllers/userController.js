const pool = require('../db/db');

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
};

const getUsers = async (req, res) => {
  const {
    role,
    sortBy = "user_id",
    sortOrder = "asc",
    page = 1,
    limit = 20,
    search = "", // ✅ added search param
  } = req.query; 

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;
  const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  const allowedSortBy = ["user_id", "name", "email", "role", "phone"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "user_id";

  try {
    let values = [];
    let conditions = [];
    let paramIndex = 1;

    // Role condition
    if (role && role !== "*" && role.toLowerCase() !== "all") {
      conditions.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    // ✅ Search condition (case-insensitive match on name or email)
    if (search.trim() !== "") {
      conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Add LIMIT and OFFSET
    const limitPlaceholder = `$${paramIndex++}`;
    const offsetPlaceholder = `$${paramIndex++}`;
    values.push(limitNum, offset);

    // Final queries
    const baseQuery = `
      SELECT * FROM users
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;
    const countQuery = `
      SELECT COUNT(*) FROM users
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, values.length - 2)),
    ]);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.status(200).json({
      users: dataResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err.stack);
    res.status(500).send("Error fetching users");
  }
};

const editUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, role, phone } = req.body;
  if (!name || !email || !role) {
    return res.status(400).send('All fields are required');
  }
  if (phone & phone.length !== 10) {
    return res.status(400).send('Phone number must be 10 digits long');
  }
  console.log('Updating user (user_id, name, email, role, phone):', { user_id, name, email, role, phone });

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, phone = $4 WHERE user_id = $5',
      [name, email, role, phone, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully');
  } catch (err) {
    res.status(500).send('Error updating user');
  }
}

const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
};

const partialUpdateUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, role, phone, password } = req.body;
  const updates = [];
  const values = [];
  let index = 1;
  if (name) {
    updates.push(`name = $${index++}`);
    values.push(name);
  }
  if (email) {
    updates.push(`email = $${index++}`);
    values.push(email);
  }
  if (role) {
    updates.push(`role = $${index++}`);
    values.push(role);
  }
  if (phone) {
    updates.push(`phone = $${index++}`);
    values.push(phone);
  }
  if (password) {
    updates.push(`password = $${index++}`);
    values.push(password);
  }
  if (updates.length === 0) {
    return res.status(400).send('No fields provided to update');
  }
  values.push(user_id);
  const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${index}`;
  try {
     await pool.query(query, values);
      res.status(200).send('User updated successfully');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user details');
  }
};




const getCount = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    res.status(200).json({ count: rows[0].count });
  } catch (err) {
    res.status(500).send('Error fetching user count');
  }
};

const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).send('Error fetching user');
  }
}

const addUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !role) {
    return res.status(400).send('All fields are required');
  }
  try {
    await pool.query('INSERT INTO users (name, email, role, password ) VALUES ($1, $2)', [name, email, role, password]);
    res.status(201).send('User added');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
};

module.exports = { getAllUsers, addUser, getCount, getUserById, getUsers, editUser, deleteUser, partialUpdateUser };
