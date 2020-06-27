const express = require("express");

const app = express();
const path = require("path");

const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const errorForAll = require("./routes/error");

const { PORT = 3000 } = process.env;

app.use(express.static(path.join(__dirname, "public")));

app.use("/", cardsRouter);
app.use("/users", usersRouter);
app.use("/", errorForAll);

app.listen(PORT);
