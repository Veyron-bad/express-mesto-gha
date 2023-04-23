const rootRoute = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');

rootRoute.use('/', routerUsers);
rootRoute.use('/users', routerUsers);
rootRoute.use('/', routerCards);
rootRoute.use('/cards', routerCards);

module.exports = rootRoute;
