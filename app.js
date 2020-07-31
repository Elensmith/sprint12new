const express = require("express");
require("dotenv").config();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");
const { mainError } = require("./middlewares/mainError");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { log } = console;

const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const NotFound = require("./errors/notFound");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .error(new Error("Email is a required field!")),
      password: Joi.string().min(8).max(30).required(),
    }),
  }),
  login,
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
      avatar: Joi.string()
        .regex(
          /^(?:https?:\/\/)(?:www\.)?((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[^._www-][a-zA-Z0-9.-]+[.][a-zA-Z]{2,}|[^._www-][a-zA-Z0-9.-]*[.][a-zA-Z]{2,})(:[1-9][0-9]{1,4})?(?:\/(?!\/)[\w\d?~-]*)*#?/,
        )
        .trim()
        .required()
        .error(new Error("It is not url")),
    }),
  }),
  createUser,
);
app.use("/cards", auth, cardsRouter);
app.use("/users", auth, usersRouter);
app.use((req, res, next) => {
  next(new NotFound("страница не найдена"));
});

app.use(errorLogger);

app.use(errors());

app.use(mainError);

app.listen(PORT, () => {
  log("App is listening to port ", PORT);
});
