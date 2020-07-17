const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/cards", auth, cardsRouter);
app.use("/users", auth, usersRouter);
app.use((req, res, next) => {
  res.status(404).json({ message: "Запрашиваемый ресурс не найден" });
  next();
});

app.listen(PORT);
