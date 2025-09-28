const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');
const validation = require('../middleware/validation');

router.get('/', recipeController.getAllRecipes);

module.exports = router;
