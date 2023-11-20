const express = require('express');
const router = express.Router();
const controller = require('../controller/usersController');
const isAuthenticated = require('../middleware/isAuth');
// const authentication = require('../middleware/authentication');
// const authorization = require('../middleware/authorization');

router.post('/register', controller.createUser);
router.post('/login', controller.login);
router.put('/update/:ID', controller.updateUser);
// router.use(authentication);
router.get('/getAll', controller.getAllUsers);
// router.get('/getAll', authorization('admin'), controller.getAllUsers);
router.get('/getUserById/:ID', controller.getUserById);
router.put('/switchtoadmin/:ID', isAuthenticated(['admin']), controller.switchToAdmin);
// router.put('/switchtoadmin/:ID', authorization('admin'), controller.switchToAdmin);
router.delete('/delete/:ID', isAuthenticated(['admin']), controller.deleteUser);

module.exports = router;