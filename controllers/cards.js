const Card = require('../models/card');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER_ERROR } = require('../utils/err-name');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
}

const createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      const message = Object.values(err.errors)
        .map(error => error.message)
        .join('; ');
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}'` })
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
      }
    })
}

const deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card })
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: `Ошибка удаления карточки` })
      }
    })
    .catch(err => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
}

const likeCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card })
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка установки like' })
      }
    })
    .catch(err => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
}

const dislikeCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card })
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка снятия like' })
      }
    })
    .catch(err => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}