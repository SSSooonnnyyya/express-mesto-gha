const { checkToken } = require('../utils/jwtAuth');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);

    req.user = {
      _id: payload._id,
    };
    return next();
  } catch (err) {
    return res.status(401).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;
