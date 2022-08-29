const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

/** подключаемся к серверу mongo */
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

/** Временная авторизация */
app.use((req, res, next) => {
  req.user = {
    _id: '630913185cdcca08973631a2',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
