const cardsRouter = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const cardsArray = path.join(__dirname, "../data/cards.json");
cardsRouter.get("/cards", (req, res) => {
  fsPromises
    .readFile(cardsArray)
    .then((data) => {
      const cards = JSON.parse(data);
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: "С сервером что-то не то" });
    });
});
module.exports = cardsRouter;
