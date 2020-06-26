const usersRouter = require("express").Router();
const fsPromises = require("fs").promises;

const path = require("path");
const usersArray = path.join(__dirname, "../data/users.json");

usersRouter.get("/users", (req, res) => {
  fsPromises
    .readFile(usersArray)
    .then((data) => {
      const users = JSON.parse(data);
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({ message: "С сервером что-то не то" });
    });
});

usersRouter.get("/users/:id", (req, res) => {
  fsPromises.readFile(usersArray).then((data) => {
    const users = JSON.parse(data);
    const user = users.find((element) => element._id === req.params.id);

    if (user) {
      res.send(user);
      return;
    }
    res
      .status(404)
      .send({ message: "Нет пользователя с таким id" })
      .catch(() => {
        res.status(500).send({ message: "С сервером что-то не то" });
      });
  });
});

module.exports = usersRouter;
