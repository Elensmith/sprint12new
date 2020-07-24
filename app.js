const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");

const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
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

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .max(30)
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .max(30)
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
      about: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().trim().required(),
    }),
  }),
  createUser
);
app.use("/cards", auth, cardsRouter);
app.use("/users", auth, usersRouter);
app.use((req, res, next) => {
  res.status(404).json({ message: "Запрашиваемый ресурс не найден" });
  next();
});
app.use(errors());
app.use((err, req, res, next) => {
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send({ message: err.message });
});
// app.listen(PORT);
app.listen(PORT, () => {
  console.log("App is listening to port ", PORT);
});
