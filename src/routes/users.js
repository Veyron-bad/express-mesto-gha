const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegEx = require('../utils/urlRegEx');
const {
  getUsers, getUserById, updateProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

routerUsers.get('/users/me', getUserInfo);
routerUsers.get('/users/:userId', getUserById);
routerUsers.get('/users', getUsers);

routerUsers.patch('/users/me', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  },
}), updateProfile);
routerUsers.patch('/users/me/avatar', celebrate({
  body: {
    avatar: Joi.string().required().pattern(urlRegEx),
  },
}), updateUserAvatar);

module.exports = routerUsers;
