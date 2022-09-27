const winston = require('winston');
const expressWinston = require('express-winston');

/** Логгер запросов */
const requireLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

/** Логгер ошибок */
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requireLogger,
  errorLogger,
};
