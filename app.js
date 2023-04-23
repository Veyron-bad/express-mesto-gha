const express = require('express');
const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./src/utils/err-name');

const { PORT = 3000 } = process.env;

const rootRoute = require('./src/routes/index');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '644557e40998e44a6b6fab07',
  };

  next();
});

app.use('/', rootRoute);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
