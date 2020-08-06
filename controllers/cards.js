const Card = require("../models/cards");
const NotFound = require("../errors/notFound");
const BadRequest = require("../errors/badRequest");
const Forbidden = require("../errors/forbidden");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card === null) {
        return next(new NotFound("Такой Карточки нет"));
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Forbidden("Вам сюда нельзя, удаляйте свои карточки, пожалуйста"),
        );
      }
      return Card.deleteOne(card)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        return Promise.reject(new BadRequest("Вы что-то не ввели"));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return Promise.reject(new BadRequest("Не ваша карточка"));
      }
      return next(new Error("Произошла ошибка при создании карточки"));
    });
};
