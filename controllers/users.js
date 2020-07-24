const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const unauthorized = require("../errors/unauthorized");
const notFound = require("../errors/notFound");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new notFound("Такого пользователя не существует");
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then(() => res.status(201).send("ok"))

      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new unauthorized("Ошибка авторизации");
      }
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};
