const express = require('express');
const router = express.Router();
const licencesController = require('../controllers/licencesController');

// Dohvati sve licence
router.get('/', licencesController.getAllLicences);

// Dodaj novu licencu
router.post('/', licencesController.createLicence);

// Ažuriraj licencu
router.put('/:id', licencesController.updateLicence);

// Obriši licencu
router.delete('/:id', licencesController.deleteLicence);

// Dodijeli licencu treneru za određeni datum
router.patch('/:id/assign', licencesController.assignLicenceToTrainer);

module.exports = router;

