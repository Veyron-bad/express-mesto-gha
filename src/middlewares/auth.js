const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/errUnauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new ErrorUnauthorized('Необходимо авторизоваться'));
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new ErrorUnauthorized('Необходимо авторизоваться'));
  }

  req.user = payload;

  return next();
};
