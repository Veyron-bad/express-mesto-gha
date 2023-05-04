const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorMongoose = require('../errors/errorMongoose');
const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorUnauthorized = require('../errors/errUnauthorized');
const ErrorNotFound = require('../errors/errorNotFound');

const { CastError } = mongoose.Error;

const {
  ERROR_NOT_FOUND, CREATED,
} = require('../utils/err-name');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      res.send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      next(new ErrorUnauthorized(err.message));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const response = user.toObject();
      delete response.password;
      res.status(CREATED).send({ data: response });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorMongoose('Пользователь с таким email уже зарегистирован'));
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new ErrorNotFound('Пользователь не найден');
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
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
      if (err instanceof CastError) {
        next(new ErrorBadRequest('Переданы не корректные данные пользователя'));
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
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
      if (err instanceof CastError) {
        next(new ErrorBadRequest('Переданы не корректные данные пользователя'));
      }
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователь не найден'));
      }

      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new ErrorBadRequest('Переданы не корректные данные пользователя'));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateUserAvatar,
  login,
  getUserInfo,
};
