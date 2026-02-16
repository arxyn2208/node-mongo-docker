const express = require('express');
const router = express.Router();
const {createUser,getAllUsers, getUserById, updateUser, deleteUser} = require('../controllers/user.controller');
const {verifyToken} = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes in this router
router.use(verifyToken);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
