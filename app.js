const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const handlerError = require('./src/middlewares/handlerError');
const rootRoute = require('./src/routes/index');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
console.log('Привет');

app.use('/', rootRoute);

app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
