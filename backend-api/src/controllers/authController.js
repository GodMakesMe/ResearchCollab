const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db/db');  // Ensure pool is correctly imported
const { OAuth2Client } = require('google-auth-library');

// Create a new OAuth2 client with your Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Make sure to set this in your .env file

// Handle Google Login
const googleLogin = async (req, res) => {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;
  console.error('Google token:', token); // Log the token for debugging
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

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

        if (password == '123456789') {
            return res.status(123).json({ message: 'Invalid credentials Try With Google Sign In' });
        }

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

// Register User same as Add User
const register = async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        if (password == '123456789') {
            return res.status(400).json({ message: 'This password is not allowed' });
        }
        const userPassword = (!password || password == '') ? '123456789' : password;
        // Salt here is for security in database.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        if (phone && phone !== '') {
            await pool.query(
                'INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)', 
                [name, email, phone, role || 'student', hashedPassword]     // default role is 'user' if not defined
            );
        }else {
            await pool.query(
                'INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)', 
                [name, email, role || 'student', hashedPassword]     // default role is 'user' if not defined
            );
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const submitRegistrationRequest = async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    const userPassword = (!password || password == '') ? '123456789' : password;
    console.log("All fields", name, email, phone, role, password);
    const created_at = new Date().toISOString(); // Get current date and time in ISO format
    if (!name || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        if (phone && phone !== '') {
            await pool.query(
                'INSERT INTO registration_requests (name, email, phone, role, password, created_at) VALUES ($1, $2, $3, $4, $5, $6)', 
                [name, email, phone, role || 'student', hashedPassword, created_at]     
            );
        }else {
            await pool.query(
                'INSERT INTO registration_requests (name, email, role, password, created_at) VALUES ($1, $2, $3, $4, $5)', 
                [name, email, role || 'student', hashedPassword, created_at]    
            );
        }

        res.status(201).json({ message: 'Registration request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting registration request' });
    }
};

const googleRegister = async (req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const role = 'student';
    const password = '123456789';
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query('Select * FROM users WHERE email = $1', [email]);
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            console.log('User already exists.');
            return res.status(401).json({ message: 'User already exists' });
        }
        await pool.query(
            'INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)', 
            [name, email, role, hashedPassword]    
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
}


module.exports = { login, register, submitRegistrationRequest, googleLogin, googleRegister };
