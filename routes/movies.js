const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const {
  validateObjectId,
  validateMovieData,
  handleValidationErrors,
} = require('../middleware/validation');

// #swagger.tags = ['Movies']
// #swagger.description = 'Endpoint to manage movies.'
router.get('/', movieController.getMovies);

router.get('/:id', validateObjectId, movieController.getMovieById);

router.post(
  '/',
  validateMovieData,
  handleValidationErrors,
  movieController.createMovie,
);

router.put(
  '/:id',
  validateObjectId,
  // validateMovieData,
  // handleValidationErrors,
  movieController.updateMovie,
);

router.delete('/:id', validateObjectId, movieController.deleteMovie);

module.exports = router;
