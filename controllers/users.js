const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require("../models/users");
const NotFound = require("../errors/notFound");
const Conflict = require("../errors/conflict");

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
      .then(() => {
        res.send({
          name,
          about,
          avatar,
          email,
        });
      })

      .catch((err) => {
        if (err.name === "MongoError" || err.code === 11000) {
          return next(new Conflict("такая почта уже есть"));
        }
        return next(err);
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
