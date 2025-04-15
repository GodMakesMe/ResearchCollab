const pool = require('../db/db');

const getAllProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM research_projects');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all projects');
  }
};


const getProjects = async (req, res) => {
  const {
    sortBy = "project_id",
    sortOrder = "asc",
    page = 1,
    limit = 20,
    search = "",
    status,
    faculty_id,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;
  const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  const allowedSortBy = ["project_id", "title", "status", "start_date", "end_date", "faculty_id"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "project_id";

  try {
    let values = [];
    let conditions = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (faculty_id) {
      conditions.push(`faculty_id = $${paramIndex}`);
      values.push(faculty_id);
      paramIndex++;
    }

    if (search.trim() !== "") {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // LIMIT and OFFSET placeholders
    values.push(limitNum, offset);
    const limitPlaceholder = `$${paramIndex++}`;
    const offsetPlaceholder = `$${paramIndex++}`;

    const baseQuery = `
      SELECT * FROM research_projects
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;

    const countQuery = `
      SELECT COUNT(*) FROM research_projects
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, values.length - 2)), // exclude limit & offset
    ]);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.status(200).json({
      projects: dataResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching projects:", err.stack);
    res.status(500).send("Error fetching projects");
  }
};
  
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM research_projects WHERE project_id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).send('Error fetching project details');
  }
}

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM research_projects WHERE project_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Project not found');
    }
    res.status(200).send('Project deleted successfully');
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Error deleting project details');
  }
}
const editProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, status, faculty_id } = req.body;
  try {
    const result = await pool.query('UPDATE research_projects SET title = $1, description = $2, start_date = $3, end_date = $4, status = $5, faculty_id = $6 WHERE project_id = $7', [title, description, start_date, end_date, status, faculty_id, id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Project not found');
    }
    res.status(200).send('Project details updated');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Error updating project details');
  }
}

const partialUpdateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, status, faculty_id } = req.body;
  const updates = [];
  const values = [];
  let index = 1;
  if (title) {
    updates.push(`title = $${index++}`);
    values.push(title);
  }
  if (description) {
    updates.push(`description = $${index++}`);
    values.push(description);
  }
  if (start_date) {
    updates.push(`start_date = $${index++}`);
    values.push(start_date);
  }
  if (end_date) {
    updates.push(`end_date = $${index++}`);
    values.push(end_date);
  }
  if (status) {
    updates.push(`status = $${index++}`);
    values.push(status);
  }
  if (faculty_id) {
    updates.push(`faculty_id = $${index++}`);
    values.push(faculty_id);
  }
  if (updates.length === 0) {
    return res.status(400).send('No fields to update');
  }
  values.push(id);
  const query = `UPDATE research_projects SET ${updates.join(', ')} WHERE project_id = $${index}`;
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).send('Project not found');
    }
    res.status(200).send('Project details updated');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Error updating project details');
  }
};

const addProjects = async (req, res) => {
  const { title, description, start_data, end_date, status, faculty_id } = req.body;
  try {
    await pool.query('INSERT INTO research_projects (title, description, start_date, end_date, status, faculty_id) VALUES ($1, $2, $3, $4, $5, $6)', [title, description, start_data, end_date, status, faculty_id]);
    res.status(201).send('Projects details updated');
  } catch (err) {
    res.status(500).send('Error adding projects details');
  }
};


module.exports = { getAllProjects, addProjects, getProjects, getProjectById, editProject, deleteProject, partialUpdateProject };
