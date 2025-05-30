const express = require('express');
const router = express.Router();
const licencesController = require('../controllers/licencesController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// SAMO ADMIN vidi sve licence
router.get('/', verifyToken, checkRole(['ADMIN']), licencesController.getAllLicences);

// SAMO ADMIN dodaje licencu
router.post('/', verifyToken, checkRole(['ADMIN']), licencesController.createLicence);

// SAMO ADMIN ažurira licencu
router.put('/:id', verifyToken, checkRole(['ADMIN']), licencesController.updateLicence);

// SAMO ADMIN briše licencu
router.delete('/:id', verifyToken, checkRole(['ADMIN']), licencesController.deleteLicence);

// USER (trener) dodjeljuje sebi licencu
router.patch('/:id/assign', verifyToken, checkRole(['USER']), licencesController.assignLicenceToTrainer);

module.exports = router;
