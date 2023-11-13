const express = require('express');
const router = express.Router();
const controller = require('../controller/venuesController');

router.post('/addVenue', controller.createVenue);
router.get('/getAllVenues', controller.getAllVenues);
router.get('/getVenueById/:ID', controller.getVenueById);
router.put('/updateVenue/:ID', controller.updateVenue);
router.delete('/deleteVenue/:ID', controller.deleteVenue);

module.exports = router;