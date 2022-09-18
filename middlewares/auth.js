const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      throw new AuthError('Пароль или почта некорректны');
    }
    next(e);
  }

  req.user = payload;
  next();
};

module.exports = auth;
