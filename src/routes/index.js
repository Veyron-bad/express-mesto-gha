const rootRoute = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/err-name');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const urlRegEx = require('../utils/urlRegEx');

rootRoute.post('/signin', login);
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

rootRoute.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = rootRoute;
