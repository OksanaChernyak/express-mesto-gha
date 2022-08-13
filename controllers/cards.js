const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const InternalServerError = require('../utils/InternalServerError');
const ForbiddenError = require('../utils/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new InternalServerError('Произошла ошибка на сервере'));
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card) {
      const ownerId = card.owner.toString();
      const userId = req.user._id;
      if (ownerId === userId) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deleted) => {
            res.status(200).send({ data: deleted });
          });
      } else {
        next(new ForbiddenError('Вы пытаетесь удалить чужую карточку'));
      }
    } else {
      next(new NotFoundError('Карточка с таким идентификатором не найдена'));
    }
  })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка с таким идентификатором не найдена'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с таким идентификатором не найдена'));
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с таким идентификатором не найдена'));
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};