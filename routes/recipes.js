const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validation = require('../middleware/validation');
const recipeController = require('../controllers/recipeController');

router.get('/', asyncHandler(recipeController.getAllRecipes));

router.get(
  '/:id',
  validation.validateObjectId,
  validation.handleValidationErrors,
  asyncHandler(recipeController.getRecipeById),
);

router.get(
  '/name/:recipeName',
  validation.handleValidationErrors,
  asyncHandler(recipeController.getRecipesByName),
);

router.post(
  '/',
  validation.validateRecipeRules,
  validation.validateRecipeNameRules,
  validation.handleValidationErrors,
  asyncHandler(recipeController.createRecipe),
);

router.put(
  '/:id',
  validation.validateObjectId,
  validation.validateRecipeUpdateRules,
  validation.handleValidationErrors,
  asyncHandler(recipeController.updateRecipe),
);

router.delete(
  '/:id',
  validation.validateObjectId,
  validation.handleValidationErrors,
  asyncHandler(recipeController.deleteRecipe),
);

module.exports = router;
