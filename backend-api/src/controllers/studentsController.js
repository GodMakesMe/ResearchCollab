const bcrypt = require('bcrypt');
require('dotenv').config();
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

const editStudents = async (req, res) => {
  const { studentit, userid, enrollment_year, program } = req.body;
  const { student_id } = req.params;

  try {
    await pool.query('UPDATE students SET studentit = $1, userid = $2, enrollment_year = $3, program = $4 WHERE student_id = $5', [studentit, userid, enrollment_year, program, student_id]);
    res.status(200).send('Student details updated');
  } catch (err) {
    res.status(500).send('Error updating student details');
  }
};

const deleteStudents = async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM students WHERE student_id = $1', [student_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send('Student deleted successfully');
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).send('Error deleting student details');
  }
}

const partialUpdateStudents = async (req, res) => {
  const { student_id } = req.params;
  const { studentit, userid, enrollment_year, program } = req.body;
  try {
    const result = await pool.query('UPDATE students SET studentit = COALESCE($1, studentit), userid = COALESCE($2, userid), enrollment_year = COALESCE($3, enrollment_year), program = COALESCE($4, program) WHERE student_id = $5', [studentit, userid, enrollment_year, program, student_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send('Student details updated');
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).send('Error updating student details');
  }
}


const addStudents = async (req, res) => {
  const { student_id, enrollment_year, program } = req.params;
  const { name, email, phone, password } = req.body;

  if (!student_id || !enrollment_year || !program || !name || !email) {
    return res.status(400).send('All fields are required');
  }

  if (!email.includes('@iiitd.ac.in')) {
    return res.status(400).send('Invalid institutional email');
  }

  try {
    const userPassword = password || '123456789';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    var userResult1 = null;
    if (phone && phone !== '') {
      userResult1 = await pool.query(
        'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
        [name, email, phone, 'student', hashedPassword]
      );
    } else {
      userResult1 = await pool.query(
        'INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING user_id',
        [name, email, 'student', hashedPassword]
      );
    }
    const userResult = userResult1;
    // const userResult = await pool.query(
    //   'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
    //   [name, email, phone || '', 'student', hashedPassword]
    // );

    const userid = userResult.rows[0].user_id;

    await pool.query(
      'INSERT INTO students (student_id, user_id, enrollment_year, program) VALUES ($1, $2, $3, $4)',
      [student_id, userid, enrollment_year, program]
    );

    res.status(201).send('Student details added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding student details');
  }
};



module.exports = { getAllStudents, getStudents, addStudents, editStudents, deleteStudents, partialUpdateStudents };
