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

    console.log("📄 Base Query:", baseQuery);
    console.log("📄 Count Query:", countQuery);
    console.log("📦 Values:", values);

    const [dataResult, countResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, values.length - 2)), // exclude limit and offset
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
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).send('User added');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
};

module.exports = { getAllUsers, addUser, getCount, getUserById, getUsers };
