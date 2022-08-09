const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCardById, createCard, addLike, deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCardById);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im),
  }),
}), createCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);
module.exports = router;