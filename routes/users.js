const usersRouter = require("express").Router();

const fs = require("fs");
const path = require("path");
const usersArray = path.join(__dirname, "../data/users.json");

const users = (cd) => {
  fs.readFile(usersArray, "utf-8", (err, data) => {
    if (err) throw err;
    cd(JSON.parse(data));
  });
};

usersRouter.get("/users", (req, res) => {
  users((data) => res.send(data));
});

usersRouter.get("/users/:id", (req, res) => {
  fs.readFile(usersArray, "utf-8", (err, data) => {
    if (err) throw err;

    const usersDB = JSON.parse(data);

    usersDB.forEach((element) => {
      if (element._id === req.params.id) {
        res.send(JSON.stringify(element));
      }
    });

    res.status(404).json({ error: "Нет пользователя с таким id" });
  });
});

module.exports = usersRouter;
