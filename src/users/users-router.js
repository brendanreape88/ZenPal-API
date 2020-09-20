const express = require("express");
const UsersService = require("./users-service");
const path = require("path");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route("/users").get((req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

usersRouter.route("/users").post(jsonBodyParser, (req, res, next) => {
  const { user_name, user_password } = req.body;
  const newUser = { user_name, user_password };

  UsersService.insertUser(req.app.get("db"), newUser)
    .then((user) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(user);
    })
    .catch(next);
});

module.exports = usersRouter;
