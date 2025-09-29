const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler')

const recipeController = require('../controllers/recipeController');
const validation = require('../middleware/validation');

router.get('/', asyncHandler(recipeController.getAllRecipes));

module.exports = router;
