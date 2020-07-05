const usersRouter = require("express").Router();

const { getUsers, createUser, getUsersById } = require("../controllers/users");

usersRouter.post("/", createUser);
usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUsersById);

module.exports = usersRouter;
