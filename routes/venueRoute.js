const express = require('express');
const router = express.Router();
const controller = require('../controller/venuesController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/addVenue', upload.single('image'), controller.createVenue);
router.get('/getAllVenues', controller.getAllVenues);
router.get('/getVenueById/:ID', controller.getVenueById);
router.put('/updateVenue/:ID', upload.single('image'), controller.updateVenue);
router.delete('/deleteVenue/:ID', controller.deleteVenue);

module.exports = router;