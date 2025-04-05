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
            'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4)', 
            [name, email, phone, role || 'user', hashedPassword]     // default role is 'user' if not defined
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
};

module.exports = { login, register };
