const express = require('express');
const router = require('express').Router();
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
router.post('/cards', express.json(), createCard);
router.delete('/cards/:cardId', express.json(), deletCardById);
router.put('/cards/:cardId/likes', express.json(), putLike);
router.delete('/cards/:cardId/likes', express.json(), deletLike);

module.exports = router;
