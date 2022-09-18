const express = require('express');
const router = require('express').Router();
const {
  validateId,
  validateUserInfo,
  validateUserAvatar,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  patchProfile,
  patchAvatar,
  getCurrentUser,
} = require('../controllers/users');

/**
 * GET /users — возвращает всех пользователей
 * GET /users/me - возвращает информацию о текущем пользователе
 * GET /users/:userId - возвращает пользователя по _id
 * POST /users — создаёт пользователя
 * PATCH /users/me — обновляет профиль
 * PATCH /users/me/avatar — обновляет аватар
 */

router.get('/users', express.json(), getUsers);
router.get('/users/me', express.json(), getCurrentUser);
router.get('/users/:id', express.json(), validateId, getUserById);
router.patch('/users/me', express.json(), validateUserInfo, patchProfile);
router.patch('/users/me/avatar', express.json(), validateUserAvatar, patchAvatar);

module.exports = router;
