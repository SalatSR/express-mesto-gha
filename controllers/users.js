const User = require('../models/user');

/** Возвращаем всех пользователей */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

/** Возвращает пользователя по _id */
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный ID пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

/** Создаёт пользователя */
const creatUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

/** Обновляет профиль */
const patchProfile = async (req, res) => {
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
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

/** Обновляет аватар */
const patchAvatar = async (req, res) => {
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
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  getUsers,
  getUserById,
  creatUser,
  patchProfile,
  patchAvatar,
};
