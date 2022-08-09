const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const InternalServerError = require('../utils/InternalServerError');
const ConflictingRequestError = require('../utils/ConflictingRequestError');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'oksana-have-secrets', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new BadRequestError('Произошла ошибка аутентификации');
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new UnauthorizedError('Вы не авторизованы');
      } else {
        res.send({ data: users });
      }
    })
    .catch(() => {
      throw new InternalServerError('Произошла ошибка на сервере');
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким идентификатором не найден');
      } else {
        res.send({ user });
      }
    })
    .catch(() => {
      throw new InternalServerError('Произошла ошибка на сервере');
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким идентификатором не найден');
      } else {
        res.send({ user });
      }
    })
    .catch((error) => {
      // console.log(error.name);
      if (error.name === 'CastError') {
        throw new BadRequestError('Некорректный id');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email }, { new: true, runValidators: true }).then((userMatches) => {
    if (userMatches) {
      throw new ConflictingRequestError('Такой пользователь уже есть');
    } else {
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }));
    }
  })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  // Объект опций для того, чтобы валидировать поля, и чтобы обновить запись в обработчике then
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким идентификатором не найден');
      } else { res.send({ user }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при редактировании профиля пользователя');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким идентификатором не найден');
      } else { res.send({ user }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при редактировании профиля аватара');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};