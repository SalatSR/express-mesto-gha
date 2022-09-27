const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { validateSignUp, validateSignIn } = require('./middlewares/validation');
const { requireLogger, errorLogger } = require('./middlewares/logger');
const ValidationError = require('./errors/ValidationError');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

dotenv.config();
const { PORT = 3000 } = process.env;

const app = express();

/** подключаемся к серверу mongo */
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

/** Конвертируем запросы в формат json */
app.use(express.json());

/** Логгер запросов */
app.use(requireLogger);

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use(cookieParser());
app.use(auth);

/** Защищённые маршруты */
app.use('/', userRouter);
app.use('/', cardRouter);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

/** Логгер ошибок */
app.use(errorLogger);

/** Обработка ошибок */

/** Ошибки celebrate */
app.use(errors());

/** Ошибка 404 */
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

/** Централизованнный обработчик ошибок */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
});

app.listen(PORT);
