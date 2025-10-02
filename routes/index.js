const router = require('express').Router();
const homeRoutes = require('./home');
const recipeRoutes = require('./recipes');
const userRoutes = require('./users');
const movieRoutes = require('./movies');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../swagger/swagger.json');

// Serve Swagger UI at /api-docs
// Move this from swagger.js to ensure proper routing and division of concerns
// router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/', homeRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/movies', movieRoutes);

module.exports = router;
