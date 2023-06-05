const { checkToken } = require('../utils/jwtAuth');
const { UnauthorisedError } = require('../utils/errors');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorisedError('Пользователь не авторизован'));
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);

    req.user = {
      _id: payload._id,
    };
    return next();
  } catch (err) {
    return next(new UnauthorisedError('Пользователь не авторизован'));
  }
};

module.exports = auth;
