const cardsRouter = require("express").Router();
const fs = require("fs");
const path = require("path");
const cardsArray = path.join(__dirname, "../data/cards.json");
const cards = (cd) => {
  fs.readFile(cardsArray, "utf-8", (err, data) => {
    if (err) throw err;
    cd(JSON.parse(data));
  });
};

cardsRouter.get("/cards", (req, res) => {
  cards((data) => res.send(data));
});

module.exports = cardsRouter;
