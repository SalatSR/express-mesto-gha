const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { validateSignUp, validateSignIn } = require('./middlewares/validation');
const ValidationError = require('./errors/ValidationError');
const auth = require('./middlewares/auth');

dotenv.config();
const { PORT = 3000 } = process.env;

const app = express();

/** подключаемся к серверу mongo */
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.post('/signup', express.json(), validateSignUp, createUser);
app.post('/signin', express.json(), validateSignIn, login);

app.use(cookieParser());
app.use(auth);

/** Защищённые маршруты */
app.use('/', userRouter);
app.use('/', cardRouter);

/** Обработка ошибок */

/** Ошибки celebrate */
app.use(errors((e) => {
  if (e.error === 'Bad Request') {
    throw new ValidationError('Переданы некорректные данные при cоздании пользователя');
  }
}));

/** Ошибка 404 */
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

/** Централизованнный обработчик ошибок */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
});

app.listen(PORT);
