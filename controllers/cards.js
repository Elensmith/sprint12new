const Card = require("../models/cards");
const notFound = require("../errors/notFound");
const badRequest = require("../errors/badRequest");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new notFound("Нет карточки с таким id");
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return res.status(403).send({ message: "Не ваша карточка" });
      }
      Card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new badRequest("Вы что-то не ввели");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      // if (err.name === "ValidationError") {
      //   return new badRequest("Вы что-то не ввели");
      // }
      next("Произошла ошибка при создании карточки");
    });
};
