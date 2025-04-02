const express = require('express');
const { getAllNotifications, addNotifications } = require('../controllers/notificationsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllNotifications);
router.post('/', authenticateAdmin, addNotifications);

module.exports = router;
