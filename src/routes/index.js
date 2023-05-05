const rootRoute = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const ErrorNotFound = require('../errors/errorNotFound');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const urlRegEx = require('../utils/urlRegEx');

rootRoute.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(urlRegEx).email(),
    password: Joi.string().required().min(8),
  }),
}), login);
rootRoute.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegEx),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

rootRoute.use(auth);
rootRoute.use('/', routerUsers);
rootRoute.use('/', routerCards);

rootRoute.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена 404'));
});

module.exports = rootRoute;
