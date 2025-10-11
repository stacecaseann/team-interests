const router = require('express').Router();
const homeRoutes = require('./home');
const recipeRoutes = require('./recipes');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const speakerRoutes = require('./conferenceSpeakers');
const favoriteBooksRoutes = require('./favoritebooks');
const programmingLanguagesRoutes = require('./programmingLanguages');
const scriptureRoutes = require('./scriptures');
const passport = require('passport');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

// Serve Swagger UI at /api-docs
// Move this from swagger.js to ensure proper routing and division of concerns
router.use('/', homeRoutes);
router.use('/users', userRoutes);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/recipes', recipeRoutes);
router.use('/movies', movieRoutes);
router.use('/speakers', speakerRoutes);
router.use('/favoritebooks', favoriteBooksRoutes);
router.use('/programmingLaunguages', programmingLanguagesRoutes);
router.use('/scriptures', scriptureRoutes);
router.get('/login', passport.authenticate('github'));

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    console.log('You are logged out');
    res.redirect('/');
  });
});

router.get('/status', (req, res) => {
  res.json(req.session.user || { status: 'Not logged in' });
});

module.exports = router;
