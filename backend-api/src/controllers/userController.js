const pool = require('../db/db');

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
};const getUsers = async (req, res) => {
  const {
    category,
    sortBy = "id",
    sortOrder = "asc",
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;
  const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  const allowedSortBy = ["id", "name", "email", "created_at", "category"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "id";

  try {
    let values = [];
    let whereClause = "";
    let paramIndex = 1;

    // Handle optional category filter
    if (category && category !== "*" && category.toLowerCase() !== "all") {
      whereClause = ` WHERE category = $${paramIndex++}`;
      values.push(category);
    }

    // Add LIMIT and OFFSET placeholders
    const limitPlaceholder = `$${paramIndex++}`;
    const offsetPlaceholder = `$${paramIndex++}`;
    values.push(limitNum, offset);

    // Construct final queries
    const baseQuery = `SELECT * FROM users${whereClause} ORDER BY ${sortColumn} ${order} LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`;
    const countQuery = `SELECT COUNT(*) FROM users${whereClause}`;

    // Log for debugging
    console.log("📄 Final Base Query:", baseQuery);
    console.log("📄 Final Count Query:", countQuery);
    console.log("📦 Values:", values);

    const [dataResult, countResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, whereClause ? 1 : 0)), // only send category to count query if applied
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




const getCount = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    res.status(200).json({ count: rows[0].count });
  } catch (err) {
    res.status(500).send('Error fetching user count');
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).send('Error fetching user');
  }
}

const addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).send('User added');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
};

module.exports = { getAllUsers, addUser, getCount, getUserById, getUsers };
