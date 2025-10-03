const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const homeController = require('../controllers/homeController');

router.get('/', asyncHandler(homeController.getHome));

module.exports = router;
