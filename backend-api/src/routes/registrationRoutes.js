const express = require('express');
const { getPendingRequests, approveRequest, rejectRequest } = require('../controllers/registrationController');
const router = express.Router();

router.get('/pending', getPendingRequests);
router.post('/approve/:requestId', approveRequest);
router.delete('/reject/:requestId', rejectRequest);

module.exports = router;
