const jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;  // Attach user data to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin-only Access
const authenticateAdmin = (req, res, next) => {
    authenticateUser(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    });
};

module.exports = { authenticateUser, authenticateAdmin };
