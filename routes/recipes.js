const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validation = require('../middleware/validation');
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.getAllRecipes);

router.get(
  '/:id',
  validation.validateObjectId,
  validation.handleValidationErrors,
  recipeController.getRecipeById,
);

router.get(
  '/name/:recipeName',
  validation.handleValidationErrors,
  recipeController.getRecipesByName,
);

router.post(
  '/',
  validation.validateRecipeRules,
  validation.validateRecipeNameRules,
  validation.handleValidationErrors,
  recipeController.createRecipe,
);

router.put(
  '/:id',
  validation.validateObjectId,
  validation.validateRecipeUpdateRules,
  validation.handleValidationErrors,
  recipeController.updateRecipe,
);

router.delete(
  '/:id',
  validation.validateObjectId,
  validation.handleValidationErrors,
  recipeController.deleteRecipe,
);

module.exports = router;
