const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./utils/err-name');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '643fd57e079a1d97fabc0722',
  };

  next();
});

app.use('/users', routerUsers);
app.use('/users', routerUsers);
app.use('/', routerUsers);

app.use('/cards', routerCards);
app.use('/cards', routerCards);
app.use('/', routerCards);

app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
