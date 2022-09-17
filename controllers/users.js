const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');

/** Возвращаем всех пользователей */
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

/** Возвращает пользователя по _id */
const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('Пользователь по указанному _id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        throw new ValidationError('Передан некорректный ID пользователя');
      }
      throw new NotFoundError(e.message);
    })
    .catch(next);
};

/** Создаёт пользователя */
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new AuthError('Пароль или почта некорректны');
  }

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then((user) => res.status(200).send({
          name,
          about,
          avatar,
          email,
        }))
        .catch((e) => {
          if (e.name === 'MongoServerError' || e.code === 11000) {
            throw new DuplicateError('Пользователь с таким email уже существует');
          } else if (e.name === 'ValidationError' || e.name === 'CastError') {
            throw new ValidationError('Переданы некорректные данные при cоздании пользователя');
          }
        })
        .catch(next);
    });
};

/** Обновляет профиль */
const patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true, // в then попадет обновленная запись
      runValidators: true, // валидация данных перед изменением
    },
  )
    .orFail(new Error('Пользователь по указанному _id не найден'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

/** Обновляет аватар */
const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError' || e.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      }
      throw new NotFoundError(e.message);
    })
    .catch(next);
};

/** Возвращает информацию о текущем пользователе */
const getCurrentUser = (req, res, next) => {

};

/** Создаём пользователя */
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, 'SECRET');
            res.cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            });
            res.send(user.toJSON());
          } else {
            res.status(403).send('неправильный пароль');
          }
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchProfile,
  patchAvatar,
  getCurrentUser,
  login,
};
