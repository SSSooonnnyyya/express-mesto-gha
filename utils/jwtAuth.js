const jwt = require('jsonwebtoken');

const SECRET_KEY = '5202642b63d2dad1690924c873ca8c208e88f8b2126fd8a93302ef810d207761';

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

const signToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

module.exports = {
  checkToken,
  signToken,
};
