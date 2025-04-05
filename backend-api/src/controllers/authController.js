const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db/db');  // Ensure pool is correctly imported

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Compare hashed password with entered password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role }, // Payload
            process.env.JWT_SECRET,  // Secret key (store in env variable)
            { expiresIn: '1h' }  // Token expiration time
        );

        res.json({ message: 'Login successful', token: `Bearer ${token}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register User
const register = async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    try {
        // Salt here is for security in database.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)', 
            [name, email, phone, role || 'user', hashedPassword]     // default role is 'user' if not defined
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const submitRegistrationRequest = async (req, res) => {
    const { name, email, phone, role, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO registration_requests (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)',
            [name, email, phone, role || 'user', hashedPassword]
        );

        res.status(201).json({ message: 'Registration request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting registration request' });
    }
};

// controllers/registrationController.js
const pool = require('../db/db');

const getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registration_requests WHERE status = $1', ['pending']);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
};

const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await pool.query('SELECT * FROM registration_requests WHERE id = $1', [requestId]);
    if (!request.rows.length) return res.status(404).json({ message: 'Request not found' });

    const { name, email, phone, role, password } = request.rows[0];
    await pool.query(
      'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone, role, password]
    );
    await pool.query('DELETE FROM registration_requests WHERE id = $1', [requestId]);

    res.json({ message: 'Request approved and user added' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving request' });
  }
};

const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    await pool.query('DELETE FROM registration_requests WHERE id = $1', [requestId]);
    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

module.exports = { getPendingRequests, approveRequest, rejectRequest };