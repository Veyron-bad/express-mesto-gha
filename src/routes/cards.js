const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const urlRegEx = require('../utils/urlRegEx');

routerCards.get('/cards', getCards);
routerCards.post('/cards', celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegEx),
  },
}), createCard);
routerCards.delete('/cards/:cardId', celebrate({
  params: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), deleteCard);
routerCards.put('/cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), likeCard);
routerCards.delete('/cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), dislikeCard);

module.exports = routerCards;
