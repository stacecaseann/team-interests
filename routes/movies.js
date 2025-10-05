const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { isAuthenticated } = require('../middleware/authentication');
const movieController = require('../controllers/users/ovinson/movieController');
const {
  validateObjectId,
  validateMovieData,
  handleValidationErrors,
} = require('../middleware/validation');

router.get('/', asyncHandler(movieController.getMovies));
router.get(
  '/:id',
  validateObjectId,
  asyncHandler(movieController.getMovieById),
);
router.post(
  '/',
  isAuthenticated,
  validateMovieData,
  handleValidationErrors,
  asyncHandler(movieController.createMovie),
);
router.put(
  '/:id',
  isAuthenticated,
  validateObjectId,
  validateMovieData,
  handleValidationErrors,
  asyncHandler(movieController.updateMovie),
);
router.delete(
  '/:id',
  isAuthenticated,
  validateObjectId,
  asyncHandler(movieController.deleteMovie),
);

module.exports = router;
