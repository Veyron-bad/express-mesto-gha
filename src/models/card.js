const mongoose = require('mongoose');
const urlRegEx = require('../utils/urlRegEx');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле не заполнено'],
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле не заполнено'],
    validate:
      (v) => urlRegEx.test(v),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле не заполнено'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
