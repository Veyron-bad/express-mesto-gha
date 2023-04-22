const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Недостаточно символов'],
    maxlength: [30, 'Большое количество символов'],
    requred: [true, 'Поле не заполнено'],
  },
  link: {
    type: String,
    required: [true, 'Поле не заполнено'],
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