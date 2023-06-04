const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateUpdateMeBody, validateUpdateMeAvatar } = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getMe);

router.get('/:user_id', usersController.getUserById);

router.patch('/me', validateUpdateMeBody, usersController.updateMe);

router.patch('/me/avatar', validateUpdateMeAvatar, usersController.updateMeAvatar);

module.exports = router;
