const express = require('express');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  creatUser,
  patchProfile,
  patchAvatar,
} = require('../controllers/users');

/**
 * GET /users — возвращает всех пользователей
 * GET /users/:userId - возвращает пользователя по _id
 * POST /users — создаёт пользователя
 * PATCH /users/me — обновляет профиль
 * PATCH /users/me/avatar — обновляет аватар
 */

router.get('/users', express.json(), getUsers);
router.get('/users/:id', express.json(), getUserById);
router.post('/users', express.json(), creatUser);
router.patch('/users/me', express.json(), patchProfile);
router.patch('/users/me/avatar', express.json(), patchAvatar);

module.exports = router;
