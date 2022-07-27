const Card = require('../models/card');
const {BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({data: cards}))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardId) => {
      if (!cardId) {
        res.status(BAD_REQUEST).send({message: 'Карточка с таким идентификатором не найдена'});
        return;
      } else {
        res.send({data: card});
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then((card) => res.send({card}))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},
  )
    .then((cardId) => {
      if (!cardId) {
        res.status(BAD_REQUEST).send({message: 'Карточка с таким идентификатором не найдена'});
        return;
      } else {
        res.send({likes: card.likes})
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'}))
}

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  )
    .then((cardId) => {
      if (!cardId) {
        res.status(BAD_REQUEST).send({message: 'Карточка с таким идентификатором не найдена'});
        return;
      } else {
        res.send({likes: card.likes})
      }
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({message: 'Произошла ошибка на сервере'})
    })
}

