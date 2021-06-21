const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const linesRouter = require('./lines/lines-router');
const itemsRouter = require('./items/items-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

/* const corsOptions = {
  origin: '', // vercel URL
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} */

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
);
app.use(cors());
app.use(helmet());

app.use('/api/lines', linesRouter);
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' };
  } else {
    console.error(error);
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
});

module.exports = app;
