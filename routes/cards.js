const router = require('express').Router();
const {
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

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:cardId', validateCardId, deletCardById);
router.put('/cards/:cardId/likes', validateCardId, putLike);
router.delete('/cards/:cardId/likes', validateCardId, deletLike);

module.exports = router;
