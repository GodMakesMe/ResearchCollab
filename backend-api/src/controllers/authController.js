const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db/db');  // Ensure pool is correctly imported
const { OAuth2Client } = require('google-auth-library');

// Create a new OAuth2 client with your Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Make sure to set this in your .env file

// Handle Google Login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    });

    // Extract the payload from the Google token
    const payload = ticket.getPayload();

    // Check if the user exists in the database
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [payload.email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' } // Token expiration
    );

    res.json({ message: 'Login successful', token: `Bearer ${jwtToken}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during Google login' });
  }
};


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



module.exports = { login, register, submitRegistrationRequest, googleLogin };
