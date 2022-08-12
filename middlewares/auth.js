const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
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