const express = require('express');
const router = express.Router();
const trainingsController = require('../controllers/trainingsController');

router.get('/', trainingsController.getAllTrainings);
router.post('/', trainingsController.createTraining);
router.put('/:id', trainingsController.updateTraining);
router.delete('/:id', trainingsController.deleteTraining);
router.patch('/:id/assign', trainingsController.assignTrainer);

module.exports = router;
