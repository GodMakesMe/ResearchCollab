const express = require('express');
const { getAllNotifications, addNotifications, editNotifications, deleteNotifications } = require('../controllers/notificationsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllNotifications);
router.post('/', authenticateAdmin, addNotifications);
router.put('/:notification_id', authenticateAdmin, editNotifications); // Assuming you want to edit notification with a specific ID
router.delete('/:notification_id', authenticateAdmin, deleteNotifications); // Assuming you want to delete notification with a specific IDs

module.exports = router;
