const express = require('express');
const router = express.Router();
const controller = require('../controller/usersController');

router.post('/register', controller.createUser);
router.get('/getAll', controller.getAllUsers);
router.get('/getUserById/:ID', controller.getUserById);
router.post('/login', controller.login);
router.put('/update/:ID', controller.updateUser);
router.put('/switchtoadmin/:ID', controller.switchToAdmin);
router.delete('/delete/:ID', controller.deleteUser);

module.exports = router;