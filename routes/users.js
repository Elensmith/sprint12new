const usersRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getUsers, getUsersById } = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
  }),
  getUsersById,
);

module.exports = usersRouter;
