const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');

/** Возвращаем всех пользователей */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    // res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    next(e);
  }
};

/** Возвращает пользователя по _id */
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      // return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      throw new NotFoundError({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      // return res.status(400).send({ message: 'Передан некорректный ID пользователя' });
      throw new ValidationError({ message: 'Передан некорректный ID пользователя' });
    }
    // return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    return next(e);
  }
};

/** Создаёт пользователя */
const createUser = async (req, res, next) => {
  try {
    // const user = await User.create(req.body);
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });

    return res.status(200).send(user);

    // return res.status(200).send({
    //   email,
    //   password,
    //   name,
    //   about,
    //   avatar,
    // });
  } catch (e) {
    if (e.name === 'ValidationError') {
      // return res.status(400).send({message:'Переданынекорректныеданныеприсозданиипользователя'});
      throw new ValidationError({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    // return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    return next(e);
  }
};

/** Обновляет профиль */
const patchProfile = async (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      // return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      throw new NotFoundError({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      // return res.status(400).send({message:'Переданынекорректныеданные при обновлении профиля'});
      throw new ValidationError({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    // return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    return next(e);
  }
};

/** Обновляет аватар */
const patchAvatar = async (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      // return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      throw new NotFoundError({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      // return res.status(400).send({message:'Переданынекорректныеданные при обновлении аватара'});
      throw new ValidationError({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    // return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    return next(e);
  }
};

/** Возвращает информацию о текущем пользователе */
const getCurrentUser = async (req, res, next) => {

};

const login = (req, res, next) => {
  const { email, password } = req.body;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchProfile,
  patchAvatar,
  getCurrentUser,
};
