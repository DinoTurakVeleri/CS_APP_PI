const express = require('express');
const router = express.Router();
const trainingsController = require('../controllers/trainingsController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// ADMIN vidi sve treninge
router.get('/', verifyToken, checkRole(['ADMIN', 'USER']), trainingsController.getAllTrainings);

// ADMIN kreira, ažurira i briše treninge
router.post('/', verifyToken, checkRole(['ADMIN']), trainingsController.createTraining);
router.put('/:id', verifyToken, checkRole(['ADMIN']), trainingsController.updateTraining);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), trainingsController.deleteTraining);

// Trener (USER) se prijavljuje na trening
router.patch('/:id/assign', verifyToken, checkRole(['USER']), trainingsController.assignTrainer);

module.exports = router;
