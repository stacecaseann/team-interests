const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');

const recipeController = require('../controllers/users/stacy/recipeController');

router.get('/', asyncHandler(recipeController.getAllRecipes));

module.exports = router;
