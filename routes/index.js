const router = require('express').Router();

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

// Serve Swagger UI at /api-docs
// Move this from swagger.js to ensure proper routing and division of concerns
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/recipes', require('./recipes'));

router.use('/speakers', require('./conferenceSpeakers'));

module.exports = router;
