const cardsRouter = require("express").Router();

const {
  getCards,
  deleteCardById,
  createCard,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCard);
cardsRouter.delete("/:id", deleteCardById);

module.exports = cardsRouter;
