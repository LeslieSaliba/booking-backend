const express = require('express');
const router = express.Router();
const controller = require('../controller/eventsController');
const isAuthenticated = require('../middleware/isAuth');

router.post('/addEvent', isAuthenticated(['admin', 'organizer']), controller.createEvent);
router.get('/getAllEvents', controller.getAllEvents);
router.get('/getEventById/:ID', controller.getEventById);
router.put('/updateEvent/:ID', isAuthenticated(['admin', 'organizer']), controller.updateEvent);
router.delete('/deleteEvent/:ID', isAuthenticated(['admin', 'organizer']), controller.deleteEvent);

module.exports = router;