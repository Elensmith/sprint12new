const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Unauthorized = require("../errors/unauthorized");
const NotFound = require("../errors/notFound");
const BadRequest = require("../errors/badRequest");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotFound("Такого пользователя не существует"),
        );
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then(() => res.status(201).send({ message: "ok" }))

      .catch((err) => {
        if (err.name === "MongoError" || err.code === 11000) {
          next(new BadRequest("такая почта уже есть"));
        }
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized("Ошибка авторизации"));
      }
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(next);
};
