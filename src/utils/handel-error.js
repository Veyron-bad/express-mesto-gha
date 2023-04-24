const { default: mongoose } = require('mongoose');

const { CastError, ValidationError } = mongoose.Error;

const {
  ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR,
} = require('./err-name');

const handelError = (err, res) => {
  if (err instanceof CastError) {
    res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы не верный данные пользователя' });
  } else if (err instanceof ValidationError) {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');

    res.status(ERROR_BAD_REQUEST).send({ message: `Введены не корректные данные: '${message}` });
  } else {
    res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  handelError,
};
