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
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .required()
        .regex(
          /^(?:https?:\/\/)(?:www\.)?((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[^._www-][a-zA-Z0-9.-]+[.][a-zA-Z]{2,}|[^._www-][a-zA-Z0-9.-]*[.][a-zA-Z]{2,})(:[1-9][0-9]{1,4})?(?:\/(?!\/)[\w\d?~-]*)*#?/,
        ),
    }),
  }),
  createCard,
);
cardsRouter.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
  }),
  deleteCardById,
);

module.exports = cardsRouter;
