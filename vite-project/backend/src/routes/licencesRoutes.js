const express = require('express');
const router = express.Router();
const licencesController = require('../controllers/licencesController');

router.get('/', licencesController.getAllLicences);
router.post('/', licencesController.createLicence);
router.put('/:id', licencesController.updateLicence);
router.delete('/:id', licencesController.deleteLicence);

// Dodijeli licencu treneru za određeni datum
router.patch('/:id/assign', licencesController.assignLicenceToTrainer);

module.exports = router;
