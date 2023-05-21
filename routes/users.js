const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.get('/:user_id', usersController.getUserById);

router.post('/', usersController.createUser);

router.patch('/me', usersController.updateMe);

router.patch('/me/avatar', usersController.updateMeAvatar);

module.exports = router;
