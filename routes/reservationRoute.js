const express = require('express');
const router = express.Router();
const controller = require('../controller/reservationController');
const isAuthenticated = require('../middleware/isAuth');

router.post('/addReservation', controller.createReservation);
router.get('/getAllReservations', controller.getAllReservations);
router.get('/getReservationById/:ID', controller.getReservationById);
router.get('/getReservationsByUser/:ID', controller.getReservationsByUser);
router.get('/getReservationsByEvent/:ID', isAuthenticated(['organizer', 'admin']), controller.getReservationsByEvent);
router.put('/updateReservation/:ID', controller.updateReservation);
router.delete('/deleteReservation/:ID', controller.deleteReservation);

module.exports = router;