const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const urlRegEx = require('../utils/urlRegEx');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate:
      (v) => urlRegEx.test(v),
  },
  email: {
    type: String,
    required: [true, 'Почта не указана'],
    unique: true,
    validate:
      (v) => validator.isEmail(v),
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Введено недостаточно символов'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неверная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверная почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
