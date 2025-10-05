const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { isAuthenticated } = require('../middleware/authentication');
const recipeController = require('../controllers/users/stacy/recipeController');

router.get('/', asyncHandler(recipeController.getAllRecipes));
router.get('/:id', asyncHandler(recipeController.getRecipeByID));
router.post('/', isAuthenticated, asyncHandler(recipeController.createRecipe));
router.put(
  '/:id',
  isAuthenticated,
  asyncHandler(recipeController.updateRecipeInfo),
);
router.delete(
  '/:id',
  isAuthenticated,
  asyncHandler(recipeController.deleteRecipe),
);

module.exports = router;
