const Card = require("../models/cards");
const NotFound = require("../errors/notFound");
const BadRequest = require("../errors/badRequest");
const Unauthorized = require("../errors/unauthorized");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFound("Карточка не найдена"));
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return Promise.reject(new Unauthorized("Не ваша карточка"));
      }
      Card.remove(card)
        .then((removedCard) =>
          res.send(
            removedCard !== null
              ? { data: card }
              : { data: "Такого объекта не существует" }
          )
        )
        .catch(next);
    })
    .catch(next);
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
      return next("Произошла ошибка при создании карточки");
    });
};
