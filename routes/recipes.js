const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation');
const recipeController = require('../controllers/recipeController');
const { isAuthenticated } = require('../middleware/authentication');

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
  isAuthenticated,
  validation.validateRecipeRules,
  validation.validateRecipeNameRules,
  validation.handleValidationErrors,
  recipeController.createRecipe,
);

router.put(
  '/:id',
  isAuthenticated,
  validation.validateObjectId,
  validation.validateRecipeUpdateRules,
  validation.handleValidationErrors,
  recipeController.updateRecipe,
);

router.delete(
  '/:id',
  isAuthenticated,
  validation.validateObjectId,
  validation.handleValidationErrors,
  recipeController.deleteRecipe,
);

module.exports = router;
