const usersRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const { getUsers, getUsersById } = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.objectId(),
    }),
  }),
  getUsersById,
);

module.exports = usersRouter;
