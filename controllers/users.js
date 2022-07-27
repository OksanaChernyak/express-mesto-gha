const User = require('../models/user');
const {NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({data: users}))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({message: 'Пользователь с таким идентификатором не найден'});
        return;
      } else {
        res.send({data: user});
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => {
        res.send({data: user})
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about})
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({message: 'Пользователь с таким идентификатором не найден'});
        return;
      } else {
        res.send({data: user})
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.updateAvatar = (req, res) => {
  const avatar = req.body.avatar;
  User.findByIdAndUpdate(req.user._id, {avatar})
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({message: 'Пользователь с таким идентификатором не найден'});
        return;
      } else {
        res.send({data: user})
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}