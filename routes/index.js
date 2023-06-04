const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateLoginBody } = require('../middlewares/validate');

router.post('/signup', validateUserBody, usersController.createUser);
router.post('/signin', validateLoginBody, usersController.login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = router;
