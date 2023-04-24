const routerUsers = require('express').Router();
const {
  createUser, getUsers, getUserById, updateProfile, updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/users/:userId', getUserById);
routerUsers.get('/users', getUsers);
routerUsers.post('/users', createUser);
routerUsers.patch('/users/me', updateProfile);
routerUsers.patch('/users/me/avatar', updateUserAvatar);

module.exports = routerUsers;
