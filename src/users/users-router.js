const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
.get('/:user_name', requireAuth, (req, res) => {

  // const user = UsersService.getUserByUserName(req.app.get('db'), req.params.user_name); // attempt 1
  // const user = getName(req.app.get('db'), req.params.user_name); // attempt 2
  // const user = getName(req, res); // attempt 3
  // return res = user.full_name;
  // return res.user = user

  UsersService.getUserByUserName(
    req.app.get("db"),
    req.params.user_name
  ).then((user) => {
    console.log('getUserByUserName() ... ', user)
    res.json(user)
  });
})
.post('/', jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name } = req.body;

  for (const field of ['full_name', 'user_name', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  // to-do: check user_name doesn't start with spaces

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get('db'), user_name)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      return UsersService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          user_name,
          password: hashedPassword,
          full_name,
          date_created: 'now()'
        };

        return UsersService.insertUser(req.app.get('db'), newUser).then((user) => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(UsersService.serializeUser(user));
        });
      });
    })
    .catch(next);
});

/* async function getName(db, user_name) { // attempt 2
  const name = await UsersService.getUserByUserName(db, user_name);
  return name;
} */

/* async function getName(req, res) { // attempt 3
  const name = await UsersService.getUserByUserName(req.app.get('db'), req.params.user_name);
  return name;
} */

module.exports = usersRouter;
