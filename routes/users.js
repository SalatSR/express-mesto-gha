const express = require('express');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchProfile,
  patchAvatar,
  getCurrentUser,
} = require('../controllers/users');

/**
 * GET /users — возвращает всех пользователей
 * GET /users/:userId - возвращает пользователя по _id
 * POST /users — создаёт пользователя
 * PATCH /users/me — обновляет профиль
 * PATCH /users/me/avatar — обновляет аватар
 * GET /users/me - возвращает информацию о текущем пользователе
 */

router.get('/users', express.json(), getUsers);
router.get('/users/:id', express.json(), getUserById);
router.post('/users', express.json(), createUser);
router.patch('/users/me', express.json(), patchProfile);
router.patch('/users/me/avatar', express.json(), patchAvatar);
router.get('/users/me', express.json(), getCurrentUser);

module.exports = router;
