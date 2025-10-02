const router = require('express').Router();
const movieController = require('../controllers/users/ovinson/movieController');
const { validateObjectId } = require('../middleware/validation');

router.get('/', movieController.getMovies);
router.get('/:id', validateObjectId, movieController.getMovieById);
router.post('/', movieController.createMovie);
router.put('/:id', validateObjectId, movieController.updateMovie);
router.delete('/:id', validateObjectId, movieController.deleteMovie);

module.exports = router;
