const express = require('express');
const router = express.Router();
const controller = require('../controller/eventsController');

router.post('/addEvent', controller.createEvent);
router.get('/getAllEvents', controller.getAllEvents);
router.get('/getEventById/:ID', controller.getEventById);
router.put('/updateEvent/:ID', controller.updateEvent);
router.delete('/deleteEvent/:ID', controller.deleteEvent);

module.exports = router;