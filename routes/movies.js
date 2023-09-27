const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const urlRegex = /^https?:\/\/[^\s/$.?#]+\.[^\s]*$/;

router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
    body: Joi.object()
      .keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().regex(urlRegex),
        trailerLink: Joi.string().required().regex(urlRegex),
        thumbnail: Joi.string().required().regex(urlRegex),
        movieId: Joi.number().required(),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
        owner: Joi.string().hex().length(24).required(),
      }),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object()
      .keys({
        movieId: Joi.string().hex(),
      }),
  }),
  deleteMovie,
);

module.exports = router;
