const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const errorForAll = require("./routes/error");

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

app.use((req, res, next) => {
  req.user = {
    _id: "5efa077e4fe855de8c42f690",
  };

  next();
});
app.use("/cards", cardsRouter);
app.use("/users", usersRouter);
app.use("/", errorForAll);

app.listen(PORT);
