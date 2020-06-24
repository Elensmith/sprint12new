const errorForAll = require("express").Router();
errorForAll.get("/:id", (req, res) => {
  res.status(404).json({ error: "Запрашиваемый ресурс не найден" });
});

module.exports = errorForAll;
