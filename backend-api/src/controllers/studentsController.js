const pool = require('../db/db');

const getAllStudents = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error fetching all students');
  }
};


const getStudents = async (req, res) => {
  const {
    page = '1',
    limit = '10',
    search = '',
    sortBy = 'student_id',
    sortOrder = 'asc'
  } = req.query;

  const pageNum = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const offset = (pageNum - 1) * pageSize;

  const validSortFields = ['student_id', 'enrollment_year', 'program'];
  const validSortOrder = ['asc', 'desc'];

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'student_id';
  const order = validSortOrder.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'asc';

  try {
    const studentsQuery = `
      SELECT * FROM Students
      WHERE program ILIKE $1 OR CAST(enrollment_year AS TEXT) ILIKE $1
      ORDER BY ${sortField} ${order}
      LIMIT $2 OFFSET $3;
    `;
    const students = await pool.query(studentsQuery, [`%${search}%`, pageSize, offset]);

    const countQuery = `
      SELECT COUNT(*) FROM Students
      WHERE program ILIKE $1 OR CAST(enrollment_year AS TEXT) ILIKE $1;
    `;
    const countResult = await pool.query(countQuery, [`%${search}%`]);
    const total = parseInt(countResult.rows[0].count, 10);

    res.status(200).json({
      students: students.rows,
      pagination: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getStudents
};



const addStudents = async (req, res) => {
  const { studentit, userid, enrollment_year, program} = req.body;
  try {
    await pool.query('INSERT INTO students (studentit, userid, enrollment_year, program) VALUES ($1, $2, $3, $4)', [studentit, userid, enrollment_year, program]);
    res.status(201).send('Student details updated');
  } catch (err) {
    res.status(500).send('Error adding students details');
  }
};

module.exports = { getAllStudents, addStudents };
