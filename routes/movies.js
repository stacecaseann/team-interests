const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authentication');

const movieController = require('../controllers/movieController');
const {
  validateObjectId,
  validateMovieData,
  handleValidationErrors,
} = require('../middleware/validation');

router.get('/', movieController.getMovies);

router.get('/:id', validateObjectId, movieController.getMovieById);

router.post(
  '/',
  isAuthenticated,
  validateMovieData,
  handleValidationErrors,
  movieController.createMovie,
);

router.put(
  '/:id',
  isAuthenticated,
  validateObjectId,
  validateMovieData,
  handleValidationErrors,
  movieController.updateMovie,
);

router.delete(
  '/:id',
  isAuthenticated,
  validateObjectId,
  movieController.deleteMovie,
);

module.exports = router;
