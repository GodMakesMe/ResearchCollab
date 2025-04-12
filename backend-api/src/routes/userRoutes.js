const express = require('express');
const { getAllUsers, addUser } = require('../controllers/userController');

const router = express.Router();
router.get('/all-users', getAllUsers);
router.get('/count', getCount);
router.get('/by-id/:id', getUserById);
router.get('/', getUsers);
router.post('/', addUser);

module.exports = router;
