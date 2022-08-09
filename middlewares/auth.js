const jwt = require('jsonwebtoken');
const BadRequestError = require('../utils/BadRequestError');
const UnauthorizedError = require('../utils/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new BadRequestError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'oksana-have-secrets');
  } catch (err) {
    throw new UnauthorizedError('Переданы неверные данные');
  }

  req.user = payload;

  next();
};