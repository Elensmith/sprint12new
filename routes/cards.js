const cardsRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getCards,
  deleteCardById,
  createCard,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(1).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard
);
cardsRouter.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum(),
    }),
  }),
  deleteCardById
);

module.exports = cardsRouter;
