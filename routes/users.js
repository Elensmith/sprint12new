const usersRouter = require("express").Router();

const { getUsers, getUsersById } = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUsersById);

module.exports = usersRouter;
