const express = require('express');
const { getAllUsers, addUser, getCount, getUserById, getUsers, partialUpdateUser, deleteUser, editUser } = require('../controllers/userController');

const router = express.Router();
router.get('/all-users', getAllUsers);
router.get('/count', getCount);
router.get('/by-id/:user_id', getUserById);
router.get('/', getUsers);
router.post('/', addUser);
router.patch('/:user_id', partialUpdateUser);
router.delete('/:user_id', deleteUser);
router.put('/:user_id', editUser);

module.exports = router;
