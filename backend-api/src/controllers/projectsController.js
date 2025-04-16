const pool = require('../db/db');

const getAllProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM research_projects');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all projects');
  }
};



const parseQueryArray = (queryParam) => {
  if (!queryParam || typeof queryParam !== 'string') return [];
  return queryParam.split(',').map(item => item.trim()).filter(Boolean);
}

// --- Controller Function to get Top 5 Domains ---
const getTopDomains = async (req, res) => {
  try {
      // Query the Domains table, order by significance descending, limit to 5
      const query = `
          SELECT
              domain_id,
              name
          FROM
              research_center.Domains
          ORDER BY
              significance DESC NULLS LAST -- Higher significance first, handle potential NULLs
          LIMIT 5;
      `;
      const { rows } = await pool.query(query);
      // Send back just the names, as the frontend likely uses names for filtering
      res.status(200).json(rows.map(row => row.name));
      // Or send the full objects if needed: res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching top domains:', error);
      res.status(500).json({ message: 'Error fetching top domains', error: error.message });
  }
};


// --- Updated filterProjectsMultiple ---
const filterProjectsMultiple = async (req, res) => {
  // --- Extract and sanitize query parameters (remains the same) ---
  const {
      search, skills, domains, professors, students, openOnly, sortBy, page = 1, limit = 10
  } = req.query;

  const searchParam = search ? `%${search}%` : null;
  const skillsArray = parseQueryArray(skills);
  const domainsArray = parseQueryArray(domains);
  const professorsArray = parseQueryArray(professors);
  const maxStudents = parseInt(students, 10) || null;
  const showOpenOnly = openOnly === 'true';
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  let queryParams = [];
  let paramIndex = 1;

  console.log("--- Backend Filter Request ---");
  console.log("Received openOnly query param:", req.query.openOnly);
  console.log("Parsed showOpenOnly boolean:", showOpenOnly);

  // --- Base query updated ---
  let baseQuery = `
      SELECT
          rp.project_id AS id,
          rp.title,
          rp.description,
          dom.name AS domain,
          ARRAY_AGG(DISTINCT exp.name) FILTER (WHERE exp.name IS NOT NULL) AS skills,
          prof_user.name AS professor,
          f.faculty_id AS "professorId",
          rp.students_needed AS "studentsNeeded",
          rp.availability,
          CASE WHEN rp.availability = 'Open' THEN rp.students_needed ELSE 0 END AS "spotsLeft",
          rp.start_date AS "postedDate" -- <<< CHANGED FROM posted_date to start_date
      FROM
          research_center.Research_Projects rp
      JOIN
          research_center.Faculty f ON rp.faculty_id = f.faculty_id
      JOIN
          research_center.Users prof_user ON f.user_id = prof_user.user_id
      LEFT JOIN
          research_center.Domains dom ON rp.domain_id = dom.domain_id
      LEFT JOIN
          research_center.Project_Skills ps ON rp.project_id = ps.project_id
      LEFT JOIN
          research_center.Expertise exp ON ps.skill_id = exp.skill_id
      WHERE 1=1
  `;

  // --- Append WHERE conditions (remains the same) ---
  if (searchParam) {
      baseQuery += ` AND (rp.title ILIKE $${paramIndex} OR rp.description ILIKE $${paramIndex})`;
      queryParams.push(searchParam);
      paramIndex++;
  }
  if (domainsArray.length > 0) {
      baseQuery += ` AND dom.name = ANY($${paramIndex}::text[])`;
      queryParams.push(domainsArray);
      paramIndex++;
  }
  if (professorsArray.length > 0) {
      baseQuery += ` AND prof_user.name = ANY($${paramIndex}::text[])`;
      queryParams.push(professorsArray);
      paramIndex++;
  }
  if (maxStudents !== null) {
      baseQuery += ` AND rp.students_needed <= $${paramIndex}`;
      queryParams.push(maxStudents);
      paramIndex++;
  }
  if (showOpenOnly) {
      baseQuery += ` AND rp.availability = 'Open'`;
  }

  // --- Grouping updated ---
  baseQuery += `
      GROUP BY
          rp.project_id,
          rp.title,
          rp.description,
          dom.name,
          prof_user.name,
          f.faculty_id,
          rp.students_needed,
          rp.availability,
          rp.start_date -- <<< CHANGED FROM posted_date to start_date
  `;

  // --- Append HAVING condition for skills (remains the same) ---
  if (skillsArray.length > 0) {
      baseQuery += ` HAVING ARRAY(SELECT unnest($${paramIndex}::text[])) <@ ARRAY_AGG(DISTINCT exp.name)`;
      queryParams.push(skillsArray);
      paramIndex++;
  }

  // --- Append ORDER BY clause updated ---
  switch (sortBy) {
      case 'newest':
          baseQuery += ' ORDER BY rp.start_date DESC'; // <<< CHANGED
          break;
      case 'spots':
           baseQuery += ` ORDER BY rp.availability DESC, CASE WHEN rp.availability = 'Open' THEN rp.students_needed ELSE 0 END ASC`;
          break;
      case 'relevance':
      default:
          baseQuery += ' ORDER BY rp.start_date DESC'; // <<< CHANGED (Defaulting to newest based on start_date)
          break;
  }

  // --- Append LIMIT and OFFSET (remains the same) ---
  baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limitNum, offset);

  // --- Execute the query (remains the same) ---
  try {
      // console.log("Executing Query:", baseQuery); // Keep for debugging if needed
      // console.log("With Params:", queryParams);
      const result = await pool.query(baseQuery, queryParams);

      const projects = result.rows.map(row => ({
          ...row,
          id: parseInt(row.id, 10),
          studentsNeeded: parseInt(row.studentsNeeded, 10),
          spotsLeft: parseInt(row.spotsLeft, 10),
          postedDate: row.postedDate ? new Date(row.postedDate).toISOString() : null,
          skills: row.skills || [],
      }));

      res.status(200).json(projects);

  } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects', error: error.message });
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

  // Basic validation for ID
  if (isNaN(parseInt(id, 10))) {
      return res.status(400).json({ message: 'Invalid project ID format.' });
  }
  const projectId = parseInt(id, 10);

  const query = `
      SELECT
          rp.project_id AS id,
          rp.title,
          rp.description,
          dom.name AS domain,
          ARRAY_AGG(DISTINCT exp.name) FILTER (WHERE exp.name IS NOT NULL) AS skills,
          prof_user.name AS professor,
          f.faculty_id AS "professorId", -- Match frontend interface key
          rp.students_needed AS "studentsNeeded",
          rp.availability, -- Fetch the raw value ('Open' or 'Closed')
          CASE WHEN rp.availability = 'Open' THEN rp.students_needed ELSE 0 END AS "spotsLeft",
          rp.start_date AS "postedDate" -- Map start_date to postedDate
      FROM
          research_center.Research_Projects rp
      JOIN -- Use JOIN since a project MUST have a faculty member
          research_center.Faculty f ON rp.faculty_id = f.faculty_id
      JOIN -- Use JOIN for the professor's user details
          research_center.Users prof_user ON f.user_id = prof_user.user_id
      LEFT JOIN -- Use LEFT JOIN in case domain is optional/null
          research_center.Domains dom ON rp.domain_id = dom.domain_id
      LEFT JOIN -- Use LEFT JOIN in case skills are optional/null
          research_center.Project_Skills ps ON rp.project_id = ps.project_id
      LEFT JOIN
          research_center.Expertise exp ON ps.skill_id = exp.skill_id
      WHERE
          rp.project_id = $1
      GROUP BY -- Group by all non-aggregated columns
          rp.project_id,
          rp.title,
          rp.description,
          dom.name,
          prof_user.name,
          f.faculty_id,
          rp.students_needed,
          rp.availability,
          rp.start_date;
  `;

  try {
      console.log(`Fetching project details for ID: ${projectId}`);
      const result = await pool.query(query, [projectId]);

      if (result.rows.length === 0) {
          console.log(`Project not found for ID: ${projectId}`);
          return res.status(404).json({ message: 'Project not found' });
      }

      // Data found, format it slightly for the frontend
      const projectData = result.rows[0];
      const formattedProject = {
          ...projectData,
          id: parseInt(projectData.id, 10),
          professorId: parseInt(projectData.professorId, 10), // Ensure professorId is number if needed, else string
          studentsNeeded: parseInt(projectData.studentsNeeded, 10),
          spotsLeft: parseInt(projectData.spotsLeft, 10),
          // Ensure skills is an array, even if null from DB
          skills: projectData.skills || [],
           // Format date to ISO string for consistency
          postedDate: projectData.postedDate ? new Date(projectData.postedDate).toISOString() : null,
          // Map DB 'Open'/'Closed' directly to frontend type
          availability: projectData.availability === 'Open' ? 'Open' : 'Closed',
      };


      console.log(`Successfully fetched project details for ID: ${projectId}`);
      res.status(200).json(formattedProject);

  } catch (error) {
      console.error(`Error fetching project details for ID ${projectId}:`, error);
      res.status(500).json({ message: 'Error fetching project details', error: error.message });
  }
};


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


module.exports = { getAllProjects, addProjects, getProjects, getProjectById, editProject, deleteProject, partialUpdateProject, filterProjectsMultiple, getTopDomains };
