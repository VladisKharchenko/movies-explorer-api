const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const handleErrors = require('./middlewares/errorHandler');
const userRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors({ credentials: true, origin: ['https://diplomvk.nomoredomainsrocks.ru', 'http://localhost:3000'] }));

app.use(cookieParser());

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        name: Joi.string().min(2).max(30),
      }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
  }),
  login,
);

app.use(authMiddleware);

app.use('/', userRoutes);
app.use('/', moviesRoutes);

app.use((req, res, next) => {
  const err = new NotFoundError('Неправильный путь');
  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(port);
