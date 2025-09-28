const router = require('express').Router();

router.use('/', require('./swagger'));

router.use('/recipes', require('./recipes'));

module.exports = router;
