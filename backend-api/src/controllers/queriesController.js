// Importing necessary modules for interacting with the database
const pool = require('../db/db');  // Assuming db.js handles database connection
const db = require('../db/db');

// 1. Find faculty members and their expertise areas
const query1 = async (req, res) => {
  try {
    const {
      department,
      expertise,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const offset = (page - 1) * pageSize;

    let filters = [];
    let values = [];

    // Apply optional filters
    if (department) {
      values.push(department);
      filters.push(`f.department = $${values.length}`);  // Changed 'd.name' to 'f.department'
    }

    if (expertise) {
      values.push(expertise);
      filters.push(`e.name = $${values.length}`);
    }

    let whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    // Sanitize sorting
    const validSortFields = {
      name: "u.name",
      department: "f.department",  // Changed 'd.name' to 'f.department'
      expertise: "e.name",
    };

    const sortColumn = validSortFields[sortBy] || "u.name";
    const sortDirection = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Main query
    const dataQuery = `
      SELECT u.name AS faculty_name, f.department, e.name AS expertise
      FROM Faculty f
      JOIN Users u ON f.user_id = u.user_id
      JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
      JOIN Expertise e ON fe.expertise_id = e.skill_id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2};
    `;

    // Total count query for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Faculty f
      JOIN Users u ON f.user_id = u.user_id
      JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
      JOIN Expertise e ON fe.expertise_id = e.skill_id
      ${whereClause};
    `;

    const result = await pool.query(dataQuery, [...values, pageSize, offset]);
    const countResult = await pool.query(countQuery, values);
    const totalRows = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRows / pageSize);

    res.json({
      data: result.rows,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalRows,
        totalPages,
      },
    });

  } catch (err) {
    console.error("Error fetching faculty expertise:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




const query2 = async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        sortBy = "faculty_name",
        sortOrder = "asc"
      } = req.query;
  
      const offset = (page - 1) * pageSize;
  
      const validSortFields = {
        faculty_name: "u.name",
        expertise_count: "expertise_count"
      };
  
      const sortColumn = validSortFields[sortBy] || "u.name";
      const sortDirection = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";
  
      const dataQuery = `
        SELECT u.name AS faculty_name, COUNT(fe.expertise_id) AS expertise_count
        FROM Faculty f
        JOIN Users u ON f.user_id = u.user_id
        JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
        GROUP BY u.name
        HAVING COUNT(fe.expertise_id) > 1
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $1 OFFSET $2;
      `;
  
      const countQuery = `
        SELECT COUNT(*) FROM (
          SELECT u.name
          FROM Faculty f
          JOIN Users u ON f.user_id = u.user_id
          JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
          GROUP BY u.name
          HAVING COUNT(fe.expertise_id) > 1
        ) AS subquery;
      `;
  
      const result = await pool.query(dataQuery, [pageSize, offset]);
      const countResult = await pool.query(countQuery);
      const totalRows = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalRows / pageSize);
  
      res.json({
        data: result.rows,
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          totalRows,
          totalPages,
        },
      });
    } catch (err) {
      console.error("Error in query2:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

// 3. Find the department with the most faculty members
const query3 = async () => {
  const result = await db.query(`
    SELECT department
    FROM Faculty
    GROUP BY department
    ORDER BY COUNT(*) DESC
    LIMIT 1;
  `);
  return result.rows;
};

// 4. List Faculty Details (Name, Email, Department)
const query4 = async () => {
  const result = await db.query(`
    SELECT u.name, u.email, f.department
    FROM Faculty f
    INNER JOIN Users u ON f.user_id = u.user_id
    ORDER BY u.name;
  `);
  return result.rows;
};

// 5. List Sample Student Details (Name, Email, Program, Enrollment Year)
const query5 = async () => {
  const result = await db.query(`
    SELECT u.name, u.email, s.program, s.enrollment_year
    FROM Students s
    INNER JOIN Users u ON s.user_id = u.user_id
    ORDER BY s.enrollment_year, u.name
    LIMIT 10;
  `);
  return result.rows;
};

// 6. List Students and Their Associated Expertise
const query6 = async () => {
  const result = await db.query(`
    SELECT u.name AS student_name, e.name AS expertise
    FROM Students s
    INNER JOIN Users u ON s.user_id = u.user_id
    INNER JOIN Student_Expertise se ON s.student_id = se.student_id
    INNER JOIN Expertise e ON se.skill_id = e.skill_id
    ORDER BY u.name;
  `);
  return result.rows;
};

// 7. Count the Number of Expertise Assigned to Each Student
const query7 = async () => {
  const result = await db.query(`
    SELECT u.name AS student_name, COUNT(se.skill_id) AS expertise_count
    FROM Students s
    INNER JOIN Users u ON s.user_id = u.user_id
    INNER JOIN Student_Expertise se ON s.student_id = se.student_id
    GROUP BY u.name;
  `);
  return result.rows;
};

// 8. List Faculty with Their Aggregated Expertise Areas
const query8 = async () => {
  const result = await db.query(`
    SELECT u.name AS faculty_name, f.department, string_agg(e.name, ', ') AS expertise_list
    FROM Faculty f
    INNER JOIN Users u ON f.user_id = u.user_id
    INNER JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
    INNER JOIN Expertise e ON fe.expertise_id = e.skill_id
    GROUP BY u.name, f.department;
  `);
  return result.rows;
};

// 9. Find the Top 2 Most Common Expertise Among Students
const query9 = async () => {
  const result = await db.query(`
    SELECT e.name AS expertise, COUNT(se.student_id) AS student_count
    FROM Student_Expertise se
    INNER JOIN Expertise e ON se.skill_id = e.skill_id
    GROUP BY e.name
    ORDER BY student_count DESC
    LIMIT 2;
  `);
  return result.rows;
};

// 10. Get the Percentage Breakdown of Users by Role
const query10 = async () => {
  const result = await db.query(`
    SELECT role, ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Users)), 2) AS percentage
    FROM Users
    GROUP BY role;
  `);
  return result.rows;
};

// 11. Average number of expertise areas per faculty member
const query11 = async () => {
  const result = await db.query(`
    SELECT ROUND(AVG(exp_count), 2) AS avg_expertise_per_faculty
    FROM (
      SELECT COUNT(fe.expertise_id) AS exp_count
      FROM Faculty f
      INNER JOIN Faculty_Expertise fe ON f.faculty_id = fe.faculty_id
      GROUP BY f.faculty_id
    );
  `);
  return result.rows;
};

module.exports = {
  query1,
  query2,
  query3,
  query4,
  query5,
  query6,
  query7,
  query8,
  query9,
  query10,
  query11
};
