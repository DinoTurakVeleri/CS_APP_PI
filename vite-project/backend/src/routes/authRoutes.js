const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta za registraciju
router.post('/register', authController.register);

// Ruta za prijavu
router.post('/login', authController.login);

module.exports = router;
