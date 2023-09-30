const Movie = require('../models/movie');
const CustomError = require('../errors/custom-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const CREATED_SUCCESSFULLY = 201;

const getMovies = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const movies = await Movie.find({ owner: ownerId });
    return res.json(movies);
  } catch (error) {
    return next(error);
  }
};

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const { _id: owner } = req.user;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    return res.status(CREATED_SUCCESSFULLY).json(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(
        new CustomError('Переданы некорректные данные при создании фильма'),
      );
    }
    return next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById({ _id: movieId });
    if (!movie) {
      throw new NotFoundError('Фильм с указанным _id не найден');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('У вас нет прав для удаления этого фильма');
    }
    await movie.deleteOne();
    return res.json({ message: 'Фильм успешно удален' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(
        new CustomError('Переданы некорректные данные для удаления фильма'),
      );
    }
    return next(error);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
