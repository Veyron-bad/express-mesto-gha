const routerUsers = require('express').Router();
const {
  createUser, getUsers, getUserById, updateProfile, updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/users/:userId', getUserById);
routerUsers.post('/', createUser);
routerUsers.get('/', getUsers);
routerUsers.patch('/users/me', updateProfile);
routerUsers.patch('/users/me/avatar', updateUserAvatar);

module.exports = routerUsers;
