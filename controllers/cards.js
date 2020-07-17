const Card = require("../models/cards");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Нет карточки с таким id" });
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        res.status(403).send({ message: "Не ваша карточка" });
        throw Error;
      }
      Card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch(() => res.status(500).send({ message: "Произошла ошибка при удалении" }));
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res
      .status(500)
      .send({ message: "Произошла ошибка при создании карточки" }));
};
