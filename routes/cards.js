const {getCards, deleteCardById, createCard, addLike, deleteLike} = require("../controllers/cards");

const router = require("express").Router();
router.get("/cards", getCards);
router.delete("/cards/:cardId", deleteCardById);
router.post("/cards", createCard);
router.put("/cards/:cardId/likes", addLike);
router.delete("/cards/:cardId/likes", deleteLike);
module.exports = router;