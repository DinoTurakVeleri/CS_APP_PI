const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// ADMIN vidi i uređuje sve korisnike
router.get('/', verifyToken, checkRole(['ADMIN']), usersController.getAllUsers);
router.post('/', verifyToken, checkRole(['ADMIN']), usersController.createUser);
router.put('/:id', verifyToken, checkRole(['ADMIN']), usersController.updateUser);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), usersController.deleteUser);

// USER dohvaća samo sebe
router.get('/me', verifyToken, checkRole(['USER', 'ADMIN']), usersController.getMyUser);

module.exports = router;
