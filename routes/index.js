const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateLoginBody } = require('../middlewares/validate');
const { NotFoundError } = require('../utils/errors');

router.post('/signup', validateUserBody, usersController.createUser);
router.post('/signin', validateLoginBody, usersController.login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError(404, 'Not found'));
});

module.exports = router;
