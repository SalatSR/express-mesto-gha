const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

/** Возвращает все карточки */
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

/** Создаёт карточку */
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

/** Удаляет карточку по _id */
const deletCardById = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(new Error('Нет такой карточки'))
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== userId) {
        next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }

      Card.findByIdAndDelete(req.params.cardId)
        .then((data) => res.status(200).send(data))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

/** Поставить лайк карточке */
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка');
      }
    })
    .catch(next);
};

/** Убрать лайк с карточки */
const deletLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для снятия лайка');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deletCardById,
  putLike,
  deletLike,
};
