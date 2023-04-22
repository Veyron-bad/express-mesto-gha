const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});