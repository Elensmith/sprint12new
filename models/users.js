const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isURL = require("validator/lib/isURL");
const isEmail = require("validator/lib/isEmail");
const Unauthorized = require("../errors/unauthorized");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Введите email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный URL",
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized("Неправильные почта или пароль"),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Unauthorized("Неправильные почта или пароль"),
          );
        }

        return user; // теперь user доступен
      });
    });
};
module.exports = mongoose.model("user", userSchema);
