const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  ERROR_NOT_FOUND, CREATED, ERROR_UNAUTHORIZED,
} = require('../utils/err-name');
const ErrorBadRequest = require('../errors/errorBadRequest');

const { CastError } = mongoose.Error;

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const ownerId = req.user._id;

  Card.create({
    name, link, owner: ownerId,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.valueOf() === req.user._id) {
        Card.deleteOne({ _id: card._id })
          .then((delCard) => {
            res.status(200).send({ data: delCard });
          });
      } else {
        // Вернуть ошибку по другому
        res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходимо авторизоваться' });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
        next(new ErrorBadRequest('Не удалось установить like'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new ErrorBadRequest('Не удалось убрать like'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
