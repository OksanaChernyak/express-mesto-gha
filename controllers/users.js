const User = require('../models/user');
const { NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      // console.log(error.name);
      if (error.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Некорректный id' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найден' });
      } else { res.send({ data: user }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании профиля пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body.avatar;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найден' });
      } else { res.send({ data: user }); }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании аватара' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};