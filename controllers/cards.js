const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const InternalServerError = require('../utils/InternalServerError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      throw new InternalServerError('Произошла ошибка на сервере');
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      const ownerId = card.owner.id;
      const userId = req.user._id;
      if (!card) {
        throw new NotFoundError('Карточка с таким идентификатором не найдена');
      } else if (ownerId !== userId) {
        throw new BadRequestError('Вы пытаетесь удалить чужую карточку');
      } else {
        res.send({ card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Карточка с таким идентификатором не найдена');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким идентификатором не найдена');
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким идентификатором не найдена');
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    });
};