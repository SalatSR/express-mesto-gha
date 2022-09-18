const express = require('express');
const router = require('express').Router();
const {
  validateId,
  validateCard,
  validateCardId,
} = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deletCardById,
  putLike,
  deletLike,
} = require('../controllers/cards');

/**
 * GET /cards — возвращает все карточки
 * POST /cards — создаёт карточку
 * DELETE /cards/:cardId — удаляет карточку по идентификатору
 * PUT /cards/:cardId/likes — поставить лайк карточке
 * DELETE /cards/:cardId/likes — убрать лайк с карточки
 */

router.get('/cards', express.json(), getCards);
router.post('/cards', express.json(), validateCard, createCard);
router.delete('/cards/:cardId', express.json(), validateCardId, deletCardById);
router.put('/cards/:cardId/likes', express.json(), validateCardId, putLike);
router.delete('/cards/:cardId/likes', express.json(), validateCardId, deletLike);

module.exports = router;
