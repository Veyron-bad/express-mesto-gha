const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const { CastError } = mongoose.Error;

const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER_ERROR } = require('../utils/err-name');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}` });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы не корректные данные пользователя' });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}` });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}` });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateUserAvatar,
};
