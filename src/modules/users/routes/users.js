const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');
const authenticateUser = require('../../../middlewares/authenticateUser');

router.post('/login', userController.loginUser);
router.post('/logout', authenticateUser, userController.logoutUser);

router.post('/', authenticateUser, userController.createUser);
router.get('/', authenticateUser, userController.getUsers);
router.get('/:id', authenticateUser, userController.getUserById);
router.put('/:id', authenticateUser, userController.updateUser);
router.delete('/:id', authenticateUser, userController.deleteUser);

module.exports = router;
