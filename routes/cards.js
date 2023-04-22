const routerCards = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post('/', createCard);
routerCards.delete('/cards/:cardId', deleteCard);
routerCards.put('/cards/:cardId/likes', likeCard);
routerCards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routerCards;