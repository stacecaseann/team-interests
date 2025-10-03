const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const movieController = require('../controllers/users/ovinson/movieController');
const { validateObjectId } = require('../middleware/validation');

router.get('/', asyncHandler(movieController.getMovies));
router.get(
  '/:id',
  validateObjectId,
  asyncHandler(movieController.getMovieById),
);
router.post('/', asyncHandler(movieController.createMovie));
router.put('/:id', validateObjectId, asyncHandler(movieController.updateMovie));
router.delete(
  '/:id',
  validateObjectId,
  asyncHandler(movieController.deleteMovie),
);

module.exports = router;
