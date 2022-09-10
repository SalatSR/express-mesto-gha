const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');

dotenv.config();
const { PORT = 3000 } = process.env;

const app = express();

/** подключаемся к серверу mongo */
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

// app.post('/signin', login);
app.post('/signup', createUser);

/** Временная авторизация */
app.use((req, res, next) => {
  req.user = {
    _id: '630913185cdcca08973631a2',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
});

app.listen(PORT);
