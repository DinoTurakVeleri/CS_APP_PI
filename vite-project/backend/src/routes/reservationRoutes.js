const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Trener vidi slobodne licence i rezervira
router.get('/free-licences', verifyToken, checkRole(['USER']), reservationController.getFreeLicencesForToday);
router.post('/reserve-licence', verifyToken, checkRole(['USER']), reservationController.reserveLicence);

module.exports = router;
