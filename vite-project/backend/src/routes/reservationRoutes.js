const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/free-licences', reservationController.getFreeLicencesForToday);
router.post('/reserve-licence', reservationController.reserveLicence);

module.exports = router;
