const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле не заполнено'],
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле не заполнено'],
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле не заполнено'],
  },
});

module.exports = mongoose.model('user', userSchema);