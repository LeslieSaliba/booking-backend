const express = require('express');
const router = express.Router();
const controller = require('../controller/reservationController');

router.post('/addReservation', controller.createReservation);
router.get('/getAllReservations', controller.getAllReservations);
router.get('/getReservationById/:ID', controller.getReservationById);
router.get('/getReservationsByUser/:ID', controller.getReservationsByUser);
router.get('/getReservationsByEvent/:ID', controller.getReservationsByEvent);
router.put('/updateReservation/:ID', controller.updateReservation);
router.delete('/deleteReservation/:ID', controller.deleteReservation);

module.exports = router;