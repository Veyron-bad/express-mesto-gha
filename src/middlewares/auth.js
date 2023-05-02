const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../utils/err-name');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходимо авторизоваться' });
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходимо авторизоваться' });
  }

  req.user = payload;

  next();
};
