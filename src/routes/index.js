const rootRoute = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/err-name');

rootRoute.use('/', routerUsers);
rootRoute.use('/', routerCards);
rootRoute.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = rootRoute;
