const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER_ERROR, CREATED,
} = require('../utils/err-name');

const { CastError, ValidationError } = mongoose.Error;

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  const ownerId = req.user._id;

  Card.create({
    name, link, owner: ownerId, likes: ownerId,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}'` });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка удаления карточки' });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Не удалось удалить карточку' });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },

    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка установки like' });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Не удалось установить like' });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка снятия like' });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Не удалось убрать like' });
      } else {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
